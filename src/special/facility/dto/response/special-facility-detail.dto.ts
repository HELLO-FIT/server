import { ApiProperty } from '@nestjs/swagger';

export class SpecialCourseDto {
  @ApiProperty({ description: '강좌 번호' })
  courseId: string;

  @ApiProperty({ description: '강좌 명' })
  courseName: string;

  @ApiProperty({ description: '종목 명' })
  itemName: string;

  @ApiProperty({ description: '시작 시간', example: '09:00' })
  startTime: string;

  @ApiProperty({ description: '종료 시간', example: '22:00' })
  endTime: string;

  @ApiProperty({ description: '강좌 요일', example: '월,수,금' })
  workday: string;

  @ApiProperty({ description: '가격', example: 10000 })
  price: number;
}

export class SpecialFacilityDetailDto {
  @ApiProperty({ description: '사업자 등록 번호' })
  businessId: string;

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

  @ApiProperty({ description: '도로명 주소' })
  address: string;

  @ApiProperty({ description: '상세 주소', nullable: true, type: String })
  detailAddress: string | null;

  @ApiProperty({ description: '시설 전화번호', nullable: true, type: String })
  phone: string | null;

  @ApiProperty({ description: '종목명 리스트', type: String, isArray: true })
  items: string[];

  @ApiProperty({ description: '장애 유형 리스트', type: String, isArray: true })
  types: string[];

  @ApiProperty({ description: '찜 여부' })
  isFavorite: boolean;

  @ApiProperty({
    description: '강좌 리스트',
    type: SpecialCourseDto,
    isArray: true,
  })
  courses: SpecialCourseDto[];
}
