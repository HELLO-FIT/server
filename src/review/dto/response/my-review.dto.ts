import { ApiProperty } from '@nestjs/swagger';

export class MyReviewDto {
  @ApiProperty({ description: '리뷰 ID' })
  id: string;

  @ApiProperty({ description: '사업자번호' })
  businessId: string;

  @ApiProperty({ description: '시설 일련번호', nullable: true, type: String })
  serialNumber: string | null;

  @ApiProperty({ description: '별점' })
  score: number;

  @ApiProperty({ description: '내용' })
  content: string;

  @ApiProperty({ description: '생성일' })
  createdAt: Date;

  @ApiProperty({ description: '시설명' })
  facilityName: string;
}
