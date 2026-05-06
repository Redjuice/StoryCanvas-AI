import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nickname: true,
        avatar: true,
        bio: true,
        createdAt: true,
      },
    })

    if (!user) {
      throw new NotFoundException('用户不存在')
    }

    return user
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    const { nickname, avatar, bio } = updateUserDto
    
    const data: any = {}
    if (nickname !== undefined) data.nickname = nickname
    if (avatar !== undefined) data.avatar = avatar
    if (bio !== undefined) data.bio = bio

    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        nickname: true,
        avatar: true,
        bio: true,
        createdAt: true,
      },
    })
  }
}
