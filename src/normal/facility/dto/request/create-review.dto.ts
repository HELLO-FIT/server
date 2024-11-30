import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsNumber } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ description: '점수', example: 4.5 })
  @IsNumber()
  score: number;

  @ApiProperty({ description: '내용', example: '좋아요' })
  @IsString()
  @Length(1, 100)
  content: string;
}
