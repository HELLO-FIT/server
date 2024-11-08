import { IsNotEmpty, IsString } from 'class-validator';

export class GetFacilityDetailDto {
  @IsNotEmpty()
  @IsString()
  businessId: string;

  @IsNotEmpty()
  @IsString()
  serialNumber: string;
}
