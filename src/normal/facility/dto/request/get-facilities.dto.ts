import { IsString, IsOptional, Length } from 'class-validator';

export class GetFacilitiesDto {
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
}
