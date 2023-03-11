import { DogUpdateRequestsDto } from './dto/dogupdate.request.dto';
import { FilesInterceptor } from '@nestjs/platform-express/multer';
import { JwtPayload } from './../auth/jwt/jwt.payload.dto';
import { GetPayload } from './../common/dacorators/get.payload.decorator';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  //홈화면 유저프로필
  @ApiOperation({ summary: '홈화면 유저 프로필 조회 api' })
  @ApiBearerAuth('Authorization')
  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(200)
  @ApiOkResponse({ description: '홈화면 유저 프로필 조회에 성공했을 경우' })
  @ApiBadRequestResponse({ description: '해당 유저가 없는 경우' })
  async getHomeUserProfile(@GetPayload() payload: JwtPayload) {
    const userId = payload.sub;
    return await this.profileService.getHomeUserProfile(userId);
  }

  //유저 프로필 조회
  @ApiOperation({ summary: '유저 프로필 조회 api' })
  @ApiBearerAuth('Authorization')
  @UseGuards(JwtAuthGuard)
  @Get(':nickname')
  @HttpCode(200)
  @ApiOkResponse({ description: '유저 프로필 조회에 성공했을 경우' })
  @ApiBadRequestResponse({ description: '해당 유저가 없는 경우' })
  async getUserProfile(@Param('nickname') nickname: string) {
    return await this.profileService.getUserProfile(nickname);
  }

  //유저 프로필 수정
  @ApiOperation({ summary: '유저 프로필 수정 api' })
  @ApiBearerAuth('Authorization')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @Put(':nickname')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        changeNickname: {
          description: '바꿀 닉네임',
          example: 'Seeder3423',
          type: 'string',
        },
        introduce: {
          description: '자기소개',
          example: '제 댕댕이만 좋아요',
          type: 'string',
        },
        files: {
          description: '이미지 업로드',
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files', 1))
  @HttpCode(201)
  @ApiCreatedResponse({ description: '수정에 성공했을 경우' })
  async updateUserProfile(
    @Param('nickname') nickname: string,
    @GetPayload() payload: JwtPayload,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() data: { introduce: string; changeNickname: string },
  ) {
    const userId = payload.sub;
    return await this.profileService.updateUserProfile(
      nickname,
      userId,
      files,
      data,
    );
  }

  //강아지 프로필 수정
  @ApiOperation({ summary: '강아지 프로필 수정 api' })
  @ApiBearerAuth('Authorization')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @Put('dogs/:id')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          description: '강아지 이름',
          example: '망고',
          type: 'string',
        },
        introduce: {
          description: '강아지 소개',
          example: '무는 강아지',
          type: 'string',
        },
        species: {
          description: '견종',
          example: '스피츠',
          type: 'string',
        },
        weight: {
          description: '강아지 몸무게',
          example: '8.5',
          type: 'number',
        },
        birthday: {
          description: '강아지 태어난 날',
          example: '2022-02-18',
          type: 'date',
        },
        bringDate: {
          description: '강아지 데리고 온 날',
          example: '2022-04-18',
          type: 'date',
        },
        files: {
          description: '이미지 업로드',
          type: 'string',
          format: 'binary',
        },
        representative: {
          description: '대표 강아지 여부',
          example: 'true',
          type: 'boolean',
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files', 1))
  @HttpCode(201)
  async updateDogProfile(
    @Param('id') id: number,
    @GetPayload() payload: JwtPayload,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() data: DogUpdateRequestsDto,
  ) {
    const userId = payload.sub;
    return await this.profileService.updateDogProfile(id, userId, files, data);
  }
}
