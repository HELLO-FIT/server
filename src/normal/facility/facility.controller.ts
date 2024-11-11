import { Controller, Get, Query, HttpException, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { FacilityService } from './facility.service';
import {
  GetFacilitiesDto,
  GetPopularFacilitiesDto,
  GetFacilityDetailDto,
} from './dto/request';
import {
  FacilitiesDto,
  PopularFacilitiesDto,
  FacilityDetail,
} from './dto/response';

@ApiTags('/normal/facilities')
@ApiResponse({ status: 400, description: '유효성 검사 실패' })
@Controller('normal/facilities')
export class FacilityController {
  constructor(private facilityService: FacilityService) {}

  @ApiOperation({ summary: '일반시설 목록 받기' })
  @ApiQuery({
    name: 'itemName',
    description:
      '종목 명 - facilityName이 없는 상황에서 localCode와 조합하여 사용할 수 있음',
    required: false,
    example: '무용(발레 등)',
  })
  @ApiQuery({
    name: 'localCode',
    description: '5자리 지역코드 - facilityName이 없을 경우 필수값',
    required: false,
    example: '11680',
  })
  @ApiQuery({
    name: 'facilityName',
    description: '시설 명 - 시설명이 있으면 localCode, itemName은 무시됩니다',
    required: false,
    example: '예다함 태권도',
  })
  @ApiResponse({
    status: 200,
    description: '시설 목록 받기 성공',
    type: FacilitiesDto,
    isArray: true,
  })
  @Get()
  async getMany(
    @Query() { localCode, itemName, facilityName }: GetFacilitiesDto,
  ): Promise<FacilitiesDto[]> {
    if (facilityName) {
      return await this.facilityService.getManyByFacilityName(facilityName);
    } else {
      if (!localCode) {
        throw new HttpException(
          'facilityName이 없을 경우 localCode는 필수입니다.',
          400,
        );
      }
      if (itemName) {
        return await this.facilityService.getManyByLocalCodeAndItemName(
          localCode,
          itemName,
        );
      } else {
        return await this.facilityService.getManyByLocalCode(localCode);
      }
    }
  }

  @ApiOperation({ summary: '일반 인기시설 목록 받기' })
  @ApiQuery({
    name: 'localCode',
    description: '5자리 지역코드',
    example: '11680',
  })
  @ApiResponse({
    status: 200,
    description: '인기 시설 목록 받기 성공',
    type: PopularFacilitiesDto,
    isArray: true,
  })
  @Get('popular')
  async getManyPopularByLocalCode(
    @Query() { localCode }: GetPopularFacilitiesDto,
  ): Promise<PopularFacilitiesDto[]> {
    return await this.facilityService.getManyPopularByLocalCode(localCode);
  }

  @ApiOperation({ summary: '일반시설 상세 정보 받기' })
  @ApiParam({
    name: 'businessId',
    description: '사업자 등록 번호',
    example: '1209094142',
  })
  @ApiParam({
    name: 'serialNumber',
    description: '시설 일련 번호',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: '시설 상세 정보 받기 성공',
    type: FacilityDetail,
  })
  @Get(':businessId/:serialNumber')
  async getDetail(
    @Param() { businessId, serialNumber }: GetFacilityDetailDto,
  ): Promise<FacilityDetail> {
    return await this.facilityService.getDetail(businessId, serialNumber);
  }
}
