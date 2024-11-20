import { ApiProperty } from '@nestjs/swagger';

export class NotificationsDto {
  @ApiProperty({ description: '알림 id' })
  id: string;

  @ApiProperty()
  businessId: string;

  @ApiProperty({ description: '시설 일련번호', nullable: false, type: String })
  serialNumber: string | null;

  @ApiProperty()
  facilityName: string;

  @ApiProperty({ description: '강좌 이름들', type: [String] })
  courseNames: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ description: '확인 여부' })
  isViewed: boolean;
}
