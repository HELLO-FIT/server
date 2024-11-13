import { IsString, Length, IsEnum, IsOptional } from 'class-validator';

export class GetPopularSpecialFacilitiesDto {
  @IsString()
  @Length(5, 5)
  localCode: string;

  @IsOptional()
  @IsEnum(['지체', '시각', '청각/언어', '지적/자폐', '뇌병변', '기타'])
  type?: string;
}
