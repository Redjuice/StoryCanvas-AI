import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AIService } from '../ai/ai.service'
import { CreateStoryDto } from './dto/create-story.dto'
import { UpdateStoryDto } from './dto/update-story.dto'

@Injectable()
export class StoriesService {
  private readonly logger = new Logger(StoriesService.name)

  constructor(
    private prisma: PrismaService,
    private aiService: AIService,
  ) {}

  async create(userId: string, createStoryDto: CreateStoryDto) {
    const { theme, ageGroup, style, pageCount, imagesPerPage } = createStoryDto

    const story = await this.prisma.story.create({
      data: {
        title: `${theme} - 绘本生成中...`,
        theme,
        ageGroup,
        style,
        pageCount,
        imagesPerPage: imagesPerPage || 1,
        status: 'GENERATING',
        userId,
      },
    })

    try {
      const providers = this.aiService.getCurrentProviders()
      this.logger.log(`开始生成故事: ${theme}`)
      this.logger.log(`文本生成: ${providers.text} (${providers.textModel})`)
      this.logger.log(`图像生成: ${providers.image} (${providers.imageModel})`)

      const storyResult = await this.aiService.generateStory(theme, ageGroup, pageCount)
      
      let parsedContent: { title: string; pages: string[] }
      try {
        // 清理 AI 返回的文本，移除 markdown 代码块标记
        let cleanedText = storyResult.text.trim()
        
        // 移除开头的 ```json 或 ```
        if (cleanedText.startsWith('```json')) {
          cleanedText = cleanedText.substring(7)
        } else if (cleanedText.startsWith('```')) {
          cleanedText = cleanedText.substring(3)
        }
        
        // 移除结尾的 ```
        if (cleanedText.endsWith('```')) {
          cleanedText = cleanedText.substring(0, cleanedText.length - 3)
        }
        
        // 再次 trim
        cleanedText = cleanedText.trim()
        
        this.logger.debug(`清理后的AI响应: ${cleanedText.substring(0, 200)}...`)
        
        parsedContent = JSON.parse(cleanedText)
        if (!parsedContent.title || !Array.isArray(parsedContent.pages)) {
          throw new Error('AI返回的JSON格式不正确，缺少title或pages字段')
        }
      } catch (error) {
        this.logger.error(`AI返回的原始文本: ${storyResult.text}`)
        throw new Error(`AI返回的文本格式不正确: ${error.message}`)
      }

      const pages = parsedContent.pages || []
      const pageData: Array<{
        pageNum: number
        text: string
        image: string
        imagePrompt: string
        storyId: string
      }> = []

      for (let i = 0; i < pages.length; i++) {
        const pageText = pages[i]
        const imagesPerPage = story.imagesPerPage || 1
        const imageUrls: string[] = []

        try {
          const providers = this.aiService.getCurrentProviders()
          this.logger.log(`正在为第${i + 1}页生成${imagesPerPage}张图片，使用: ${providers.image} (${providers.imageModel})`)
          
          for (let j = 0; j < imagesPerPage; j++) {
            try {
              const imageResult = await this.aiService.generateImage(pageText, style, { n: 1 })
              if (imageResult.url) {
                imageUrls.push(imageResult.url)
              }
            } catch (error) {
              this.logger.error(`生成第${i + 1}页第${j + 1}张图片失败: ${error.message}`)
            }
          }
          
          this.logger.log(`第${i + 1}页成功生成${imageUrls.length}张图片`)
        } catch (error) {
          this.logger.error(`生成第${i + 1}页图片失败: ${error.message}`)
        }

        pageData.push({
          pageNum: i + 1,
          text: pageText,
          image: imageUrls.join(','),
          imagePrompt: pageText,
          storyId: story.id,
        })
      }

      if (pageData.length > 0) {
        await this.prisma.page.createMany({ data: pageData })
      }

      const updatedStory = await this.prisma.story.update({
        where: { id: story.id },
        data: {
          status: 'COMPLETED',
          title: parsedContent.title || `${theme} - 绘本`,
          cover: pageData[0]?.image?.split(',')[0] || null,
        },
        include: {
          pages: {
            orderBy: { pageNum: 'asc' },
          },
        },
      })

      this.logger.log(`故事生成完成: ${story.id}`)
      return updatedStory

    } catch (error) {
      this.logger.error(`故事生成失败: ${error.message}`)
      await this.prisma.story.update({
        where: { id: story.id },
        data: { status: 'FAILED' },
      })
      throw new Error(`故事生成失败: ${error.message}`)
    }
  }

  async findAll(userId: string, status?: string) {
    const where: any = { userId }
    if (status && status !== 'all') {
      where.status = status.toUpperCase()
    }

    return this.prisma.story.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        pages: {
          take: 1,
          orderBy: { pageNum: 'asc' },
        },
      },
    })
  }

  async findById(id: string) {
    const story = await this.prisma.story.findUnique({
      where: { id },
      include: {
        pages: {
          orderBy: { pageNum: 'asc' },
        },
      },
    })

    if (!story) {
      throw new NotFoundException('故事不存在')
    }

    return story
  }

  async update(id: string, userId: string, updateStoryDto: UpdateStoryDto) {
    const story = await this.findById(id)

    if (story.userId !== userId) {
      throw new BadRequestException('无权操作此故事')
    }

    const { pages, ...storyData } = updateStoryDto

    // 如果提供了页面数据，先更新页面
    if (pages && pages.length > 0) {
      for (const page of pages) {
        await this.prisma.page.updateMany({
          where: {
            storyId: id,
            pageNum: page.pageNumber,
          },
          data: {
            text: page.content,
            image: page.imageUrl,
          },
        })
      }
    }

    // 更新故事基本信息
    return this.prisma.story.update({
      where: { id },
      data: storyData,
      include: {
        pages: {
          orderBy: { pageNum: 'asc' },
        },
      },
    })
  }

  /**
   * 删除故事
   * 注意：由于 Prisma schema 中配置了 onDelete: Cascade，删除故事时会自动级联删除关联的页面
   */
  async remove(id: string, userId: string) {
    const story = await this.findById(id)

    if (story.userId !== userId) {
      throw new BadRequestException('无权操作此故事')
    }

    await this.prisma.story.delete({
      where: { id },
    })
  }

  async regeneratePage(id: string, userId: string, pageNum: number) {
    const story = await this.findById(id)

    if (story.userId !== userId) {
      throw new BadRequestException('无权操作此故事')
    }

    const page = story.pages.find((p) => p.pageNum === pageNum)

    if (!page) {
      throw new NotFoundException('页面不存在')
    }

    try {
      this.logger.log(`开始重新生成第${pageNum}页图片，文本: ${page.text.substring(0, 50)}...`)
      
      const imageResult = await this.aiService.generateImage(page.text, story.style)
      this.logger.log(`AI生成图片结果: ${imageResult.url.substring(0, 100)}...`)

      await this.prisma.page.update({
        where: { id: page.id },
        data: {
          image: imageResult.url,
        },
      })
      this.logger.log(`数据库已更新第${pageNum}页图片`)

      const updatedStory = await this.findById(id)
      const updatedPage = updatedStory.pages.find(p => p.pageNum === pageNum)
      this.logger.log(`返回更新后的第${pageNum}页图片: ${updatedPage?.image?.substring(0, 100)}...`)

      return updatedStory
    } catch (error) {
      this.logger.error(`重新生成第${pageNum}页图片失败: ${error.message}`)
      throw new Error(`重新生成图片失败: ${error.message}`)
    }
  }
}
