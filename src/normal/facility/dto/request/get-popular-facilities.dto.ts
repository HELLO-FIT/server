import { IsString, Length } from 'class-validator';

export class GetPopularFacilitiesDto {
  @IsString()
  @Length(5, 5)
  localCode: string;
}
