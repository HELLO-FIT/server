import { Controller, Get, Query, HttpException, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiParam,
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

@ApiTags('/special/facilities')
@ApiResponse({ status: 400, description: '유효성 검사 실패' })
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
    @Query() { localCode, type }: GetPopularSpecialFacilitiesDto,
  ): Promise<PopularSpecialFacilitiesDto[]> {
    if (type) {
      return await this.specialFacilityService.getManyPopularByLocalCodeAndType(
        localCode,
        type,
      );
    }
    return await this.specialFacilityService.getManyPopularByLocalCode(
      localCode,
    );
  }

  @ApiOperation({ summary: '특수시설 상세 정보 받기' })
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
  async getDetail(
    @Param('businessId') businessId: string,
  ): Promise<SpecialFacilityDetailDto> {
    return await this.specialFacilityService.getDetail(businessId);
  }
}
