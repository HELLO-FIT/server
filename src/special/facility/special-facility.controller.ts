import {
  Controller,
  Get,
  Query,
  HttpException,
  Param,
  Put,
  HttpCode,
  UseGuards,
  Post,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SpecialFacilityService } from './special-facility.service';
import {
  GetSpecialFacilitiesDto,
  GetPopularSpecialFacilitiesDto,
} from './dto/request';
import {
  SpecialFacilitiesDto,
  PopularSpecialFacilitiesDto,
  SpecialFacilityDetailDto,
} from './dto/response';
import { JwtGuard, JwtOptionalGuard } from 'src/common/guards';
import { CurrentUser, OptionalCurrentUser } from 'src/common/decorators';
import { CreateReviewDto } from 'src/normal/facility/dto/request';

@ApiTags('/special/facilities')
@ApiResponse({ status: 400, description: '유효성 검사 실패' })
@ApiResponse({ status: 401, description: '로그인 필요' })
@Controller('special/facilities')
export class SpecialFacilityController {
  constructor(private specialFacilityService: SpecialFacilityService) {}

  @ApiOperation({ summary: '특수시설 목록 받기' })
  @ApiQuery({
    name: 'type',
    description: '장애 유형',
    required: false,
    enum: ['지체', '시각', '청각/언어', '지적/자폐', '뇌병변', '기타'],
    example: '시각',
  })
  @ApiQuery({
    name: 'itemName',
    description: '종목 명',
    required: false,
    example: '탁구',
  })
  @ApiQuery({
    name: 'localCode',
    description:
      '5자리 지역코드 - facilityName이 없을 땐 필수값이고 itemName, type과 조합하여 사용할 수 있음',
    required: false,
    example: '41460',
  })
  @ApiQuery({
    name: 'facilityName',
    description:
      '시설 명 - 시설명이 있으면 localCode, itemName, type은 무시됩니다',
    required: false,
    example: '죽전탁구',
  })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: SpecialFacilitiesDto,
    isArray: true,
  })
  @Get()
  async getMany(
    @Query()
    { localCode, itemName, facilityName, type }: GetSpecialFacilitiesDto,
  ): Promise<SpecialFacilitiesDto[]> {
    if (facilityName) {
      return await this.specialFacilityService.getManyByFacilityName(
        facilityName,
      );
    }
    if (!localCode) {
      throw new HttpException(
        'facilityName이 없을땐 localCode는 필수값입니다',
        400,
      );
    }

    if (itemName) {
      if (type) {
        return await this.specialFacilityService.getManyByLocalCodeAndItemNameAndType(
          localCode,
          itemName,
          type,
        );
      }
      return await this.specialFacilityService.getManyByLocalCodeAndItemName(
        localCode,
        itemName,
      );
    }
    if (type) {
      return await this.specialFacilityService.getManyByLocalCodeAndType(
        localCode,
        type,
      );
    }
    return await this.specialFacilityService.getManyByLocalCode(localCode);
  }

  @ApiOperation({ summary: '특수 인기시설 목록 받기' })
  @ApiQuery({
    name: 'type',
    description: '장애 유형',
    required: false,
    enum: ['지체', '시각', '청각/언어', '지적/자폐', '뇌병변', '기타'],
  })
  @ApiQuery({
    name: 'itemName',
    description: '종목 명',
    example: '헬스',
    required: false,
  })
  @ApiQuery({
    name: 'localCode',
    description: '5자리 지역코드',
    example: '11680',
  })
  @ApiResponse({
    status: 200,
    description: '성공',
    isArray: true,
    type: PopularSpecialFacilitiesDto,
  })
  @Get('popular')
  async getManyPopularByLocalCode(
    @Query() { localCode, type, itemName }: GetPopularSpecialFacilitiesDto,
  ): Promise<PopularSpecialFacilitiesDto[]> {
    if (type) {
      if (itemName) {
        return await this.specialFacilityService.getManyPopularByItemNameAndType(
          { localCode, itemName, type },
        );
      }
      return await this.specialFacilityService.getManyPopularByType(
        localCode,
        type,
      );
    }
    if (itemName) {
      return await this.specialFacilityService.getManyPopularByItemName(
        localCode,
        itemName,
      );
    }
    return await this.specialFacilityService.getManyPopular(localCode);
  }

  @ApiOperation({ summary: '특수시설 상세 정보 받기' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'businessId',
    description: '사업자 등록 번호',
    example: '7607000537',
  })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: SpecialFacilityDetailDto,
  })
  @Get(':businessId')
  @UseGuards(JwtOptionalGuard)
  async getDetail(
    @Param('businessId') businessId: string,
    @OptionalCurrentUser() userId: string | null,
  ): Promise<SpecialFacilityDetailDto> {
    return await this.specialFacilityService.getDetail(businessId, userId);
  }

  @ApiOperation({ summary: '특수시설 찜하기(토글)' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'businessId',
    description: '사업자 등록 번호',
    example: '7607000537',
  })
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @Put(':businessId/favorite')
  @HttpCode(204)
  @UseGuards(JwtGuard)
  async toggleFavorite(
    @Param('businessId') businessId: string,
    @CurrentUser() userId: string,
  ) {
    return await this.specialFacilityService.toggleFavorite(userId, businessId);
  }

  @ApiOperation({ summary: '특수시설 리뷰 작성' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'businessId',
    description: '사업자 등록 번호',
    example: '7607000537',
  })
  @ApiResponse({ status: 201, description: '성공' })
  @ApiResponse({ status: 409, description: '이미 리뷰를 작성했습니다' })
  @Post(':businessId/review')
  @HttpCode(201)
  @UseGuards(JwtGuard)
  async createReview(
    @Param('businessId') businessId: string,
    @CurrentUser() userId: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    await this.specialFacilityService.createReview({
      userId,
      businessId,
      ...createReviewDto,
    });
    return;
  }
}
