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
    const { theme, ageGroup, style, pageCount } = createStoryDto

    const story = await this.prisma.story.create({
      data: {
        title: `${theme} - 绘本生成中...`,
        theme,
        ageGroup,
        style,
        pageCount,
        status: 'GENERATING',
        userId,
      },
    })

    try {
      this.logger.log(`开始生成故事: ${theme}`)

      const storyResult = await this.aiService.generateStory(theme, ageGroup, pageCount)
      
      let parsedContent: { title: string; pages: string[] }
      try {
        parsedContent = JSON.parse(storyResult.text)
        if (!parsedContent.title || !Array.isArray(parsedContent.pages)) {
          throw new Error('AI返回的JSON格式不正确，缺少title或pages字段')
        }
      } catch (error) {
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
        let imageUrl = ''

        try {
          const imageResult = await this.aiService.generateImage(pageText, style)
          imageUrl = imageResult.url
        } catch (error) {
          this.logger.error(`生成第${i + 1}页图片失败: ${error.message}`)
        }

        pageData.push({
          pageNum: i + 1,
          text: pageText,
          image: imageUrl,
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
          cover: pageData[0]?.image || null,
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

    return this.prisma.story.update({
      where: { id },
      data: updateStoryDto,
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
      const imageResult = await this.aiService.generateImage(page.text, story.style)

      await this.prisma.page.update({
        where: { id: page.id },
        data: {
          image: imageResult.url,
        },
      })

      return this.findById(id)
    } catch (error) {
      this.logger.error(`重新生成第${pageNum}页图片失败: ${error.message}`)
      throw new Error(`重新生成图片失败: ${error.message}`)
    }
  }
}
