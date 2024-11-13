import { ApiProperty } from '@nestjs/swagger';

export class FavoriteFacilitiesDto {
  @ApiProperty({ description: '사업자 등록 번호' })
  businessId: string;

  @ApiProperty({
    description:
      '시설 일련 번호 - 특수시설이면 없습니다. 시설 일련번호의 유무를 통해 일반시설과 특수시설을 구분해서 상세페이지 이동 시 링크 설정해주세요',
    required: false,
  })
  serialNumber?: string;

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

  @ApiProperty({
    description: '대표자명 - 특수시설이면 없습니다',
    required: false,
  })
  owner?: string;

  @ApiProperty({ description: '종목명 리스트', type: String, isArray: true })
  items: string[];
}
