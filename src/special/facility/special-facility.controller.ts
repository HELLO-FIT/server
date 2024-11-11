import { Controller, Get, Query, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { SpecialFacilityService } from './special-facility.service';
import { GetSpecialFacilitiesDto } from './dto/request';
import { SpecialFacilitiesDto } from './dto/response';

@ApiTags('/special/facilities')
@ApiResponse({ status: 400, description: '유효성 검사 실패' })
@Controller('special/facilities')
export class SpecialFacilityController {
  constructor(private specialFacilityService: SpecialFacilityService) {}

  @ApiOperation({ summary: '특수시설 목록 받기' })
  @ApiQuery({
    name: 'itemName',
    description:
      '종목 명 - facilityName이 없는 상황에서 localCode와 조합하여 사용할 수 있음',
    required: false,
    example: '탁구',
  })
  @ApiQuery({
    name: 'localCode',
    description: '5자리 지역코드 - facilityName이 없을 땐 필수값',
    required: false,
    example: '41460',
  })
  @ApiQuery({
    name: 'facilityName',
    description: '시설 명 - 시설명이 있으면 localCode, itemName은 무시됩니다',
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
    @Query() { localCode, itemName, facilityName }: GetSpecialFacilitiesDto,
  ): Promise<SpecialFacilitiesDto[]> {
    if (facilityName) {
      return await this.specialFacilityService.getManyByFacilityName(
        facilityName,
      );
    } else {
      if (!localCode) {
        throw new HttpException(
          'facilityName이 없을땐 localCode는 필수값입니다',
          400,
        );
      }

      if (itemName) {
        return await this.specialFacilityService.getManyByLocalCodeAndItemName(
          localCode,
          itemName,
        );
      } else {
        return await this.specialFacilityService.getManyByLocalCode(localCode);
      }
    }
  }
}
