import { IsString, Length } from 'class-validator';

export class GetPopularSpecialFacilitiesDto {
  @IsString()
  @Length(5, 5)
  localCode: string;
}
