import { IsString, Length, IsOptional } from 'class-validator';

export class GetPopularFacilitiesDto {
  @IsString()
  @Length(5, 5)
  localCode: string;

  @IsOptional()
  @IsString()
  itemName?: string;
}
