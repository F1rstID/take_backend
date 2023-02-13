import { GetPayload } from './../../common/dacorators/get.payload.decorator';
import { JwtPayload } from './../../auth/jwt/jwt.payload.dto';
import { PostsService } from './../services/posts.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PostsCreateRequestsDto } from '../dto/postscreate.request.dto';
import { FilesInterceptor } from '@nestjs/platform-express/multer';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  //의존성 주입
  constructor(private readonly postsService: PostsService) {}

  //게시글 작성 api
  @ApiOperation({ summary: '게시글 작성 api' })
  @ApiBearerAuth('Authorization')
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('images', 5))
  async createPosts(
    @GetPayload() payload: JwtPayload,
    @Body() data: PostsCreateRequestsDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return await this.postsService.createPosts(data, 'project', files, payload);
  }

  //게시글 전체 조회 api
  @ApiOperation({ summary: '게시글 조회 api' })
  @ApiBearerAuth('Authorization')
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllPosts(@GetPayload() payload: JwtPayload) {
    return await this.postsService.getAllPosts(payload);
  }

  //게시글 상세조회 api
  @ApiOperation({ summary: '게시글 상세 조회 api' })
  @ApiBearerAuth('Authorization')
  @UseGuards(JwtAuthGuard)
  @Get(':postId')
  async getOnePost(
    @Param('postId') postId: number,
    @GetPayload() payload: JwtPayload,
  ) {
    return await this.postsService.getOnePost(postId, payload);
  }

  //게시글 수정 api
  @ApiOperation({ summary: '게시글 수정 api' })
  @ApiBearerAuth('Authorization')
  @UseGuards(JwtAuthGuard)
  @Put(':postId')
  @UseInterceptors(FilesInterceptor('images', 5))
  async updatePost(
    @Body() data: PostsCreateRequestsDto,
    @Param('postId') postId: number,
    @GetPayload() payload: JwtPayload,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return await this.postsService.updatePost(
      postId,
      data,
      'project',
      payload,
      files,
    );
  }
}
