import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateStoryDto } from './dto/create-story.dto'
import { UpdateStoryDto } from './dto/update-story.dto'

@Injectable()
export class StoriesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createStoryDto: CreateStoryDto) {
    const { theme, ageGroup, style, pageCount } = createStoryDto

    const story = await this.prisma.story.create({
      data: {
        title: `${theme} - 绘本`,
        theme,
        ageGroup,
        style,
        pageCount,
        status: 'GENERATING',
        userId,
      },
    })

    const mockPages = this.generateMockStory(theme, pageCount)

    await this.prisma.page.createMany({
      data: mockPages.map((page, index) => ({
        pageNum: index + 1,
        text: page.text,
        image: page.image,
        imagePrompt: page.imagePrompt,
        storyId: story.id,
      })),
    })

    return this.findById(story.id)
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

    const newImage = this.generateMockImage(story.theme, story.style)

    await this.prisma.page.update({
      where: { id: page.id },
      data: {
        image: newImage,
      },
    })

    return this.findById(id)
  }

  private generateMockStory(theme: string, pageCount: number) {
    const pages: Array<{ text: string; image: string; imagePrompt: string }> = []
    for (let i = 1; i <= pageCount; i++) {
      pages.push({
        text: `第${i}页：${theme}的故事正在展开...`,
        image: `https://picsum.photos/seed/${theme}${i}/400/300`,
        imagePrompt: `${theme} - 页面${i}`,
      })
    }
    return pages
  }

  private generateMockImage(theme: string, style: string): string {
    return `https://picsum.photos/seed/${theme}${style}${Date.now()}/400/300`
  }
}
