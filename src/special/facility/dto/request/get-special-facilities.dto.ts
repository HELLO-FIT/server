import { IsString, IsOptional, Length, IsEnum } from 'class-validator';

export class GetSpecialFacilitiesDto {
  @IsOptional()
  @IsString()
  @Length(5, 5)
  localCode?: string;

  @IsOptional()
  @IsString()
  itemName?: string;

  @IsOptional()
  @IsString()
  facilityName?: string;

  @IsOptional()
  @IsEnum(['지체', '시각', '청각/언어', '지적/자폐', '뇌병변', '기타'])
  type?: string;
}
