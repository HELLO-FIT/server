import { ApiProperty } from '@nestjs/swagger';

export class MyProfileDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  nickname: string;

  @ApiProperty()
  provider: string;

  @ApiProperty()
  createdAt: Date;
}
