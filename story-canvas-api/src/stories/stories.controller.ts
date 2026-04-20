import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common'
import { StoriesService } from './stories.service'
import { CreateStoryDto } from './dto/create-story.dto'
import { UpdateStoryDto } from './dto/update-story.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('stories')
@UseGuards(JwtAuthGuard)
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Post()
  async create(@Req() req: any, @Body() createStoryDto: CreateStoryDto) {
    return this.storiesService.create(req.user.userId, createStoryDto)
  }

  @Get()
  async findAll(@Req() req: any, @Query('status') status?: string) {
    return this.storiesService.findAll(req.user.userId, status)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.storiesService.findById(id)
  }

  @Patch(':id')
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateStoryDto: UpdateStoryDto,
  ) {
    return this.storiesService.update(id, req.user.userId, updateStoryDto)
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    return this.storiesService.remove(id, req.user.userId)
  }

  @Post(':id/regenerate')
  async regeneratePage(
    @Req() req: any,
    @Param('id') id: string,
    @Body('pageNum', ParseIntPipe) pageNum: number,
  ) {
    return this.storiesService.regeneratePage(id, req.user.userId, pageNum)
  }
}
