import { ApiProperty } from '@nestjs/swagger';

export class PopularFacilitiesDto {
  @ApiProperty({ description: '사업자 등록 번호 (PK)' })
  businessId: string;

  @ApiProperty({ description: '시설 일련 번호 (PK)' })
  serialNumber: string;

  @ApiProperty({ description: '시설 명' })
  name: string;

  @ApiProperty({ description: '시도 코드' })
  cityCode: string;

  @ApiProperty({ description: '시도 명' })
  cityName: string;

  @ApiProperty({ description: '시군구 코드' })
  localCode: string;

  @ApiProperty({ description: '시군구 명' })
  localName: string;

  @ApiProperty({
    description: '도로명 주소인데 하나씩 도로명주소 아닌게있긴함',
  })
  address: string;

  @ApiProperty({ description: '상세 주소', nullable: true, type: String })
  detailAddress: string | null;

  @ApiProperty({ description: '대표자명' })
  owner: string;

  @ApiProperty({ description: '누적 수강생 수' })
  totalParticipantCount: number;

  @ApiProperty({ description: '종목명 리스트', type: String, isArray: true })
  items: string[];
}
