import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiParam, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FacilityService } from './facility.service';
import { GetFacilitiesDto } from './dto/request';
import { FacilitiesDto } from './dto/response';

@ApiTags('normal/facilities')
@ApiResponse({ status: 400, description: '유효성 검사 실패' })
@Controller('normal/facilities')
export class FacilityController {
  constructor(private facilityService: FacilityService) {}

  @ApiOperation({ summary: '일반시설 목록 받기' })
  @ApiParam({
    name: 'itemName',
    description: '종목 명',
    required: false,
    example: '무용(발레 등)',
  })
  @ApiParam({ name: 'localCode', description: '5자리 지역코드' })
  @ApiResponse({
    status: 200,
    description: '시설 목록 받기 성공',
    type: FacilitiesDto,
    isArray: true,
  })
  @Get()
  async getMany(
    @Query() { localCode, itemName }: GetFacilitiesDto,
  ): Promise<FacilitiesDto[]> {
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
