import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class GetFacilitiesDto {
  @IsString()
  @IsNotEmpty()
  localCode: string;

  @IsOptional()
  @IsString()
  itemName?: string;
}
