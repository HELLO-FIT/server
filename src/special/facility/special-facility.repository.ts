import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SpecialFacilityRepository {
  constructor(private prisma: PrismaService) {}

  async findManyByLocalCode(localCode: string) {
    return (await this.prisma.$queryRaw`
      select
        a."businessId",
        b."name",
        b."cityCode",
        b."cityName",
        b."localCode",
        b."localName",
        b."address",
        b."detailAddress",
        a."items"
      from (
        select
          f."businessId",
          string_agg(distinct c."itemName", ',') as "items"
        from "SpecialFacility" f join "SpecialCourse" c
        on f."businessId" = c."businessId"
        where "localCode" = ${localCode}
        group by f."businessId" 
      ) a join "SpecialFacility" b
      on a."businessId" = b."businessId"
    `) as SpecialFacilitiesInfo[];
  }

  async findManyByLocalCodeAndItemName(localCode: string, itemName: string) {
    return (await this.prisma.$queryRaw`
      select
        a."businessId",
        b."name",
        b."cityCode",
        b."cityName",
        b."localCode",
        b."localName",
        b."address",
        b."detailAddress",
        a."items"
      from (
        select
          f."businessId",
          string_agg(distinct c."itemName", ',') as "items"
        from "SpecialFacility" f join "SpecialCourse" c
        on f."businessId" = c."businessId"
        where "localCode" = ${localCode} and c."itemName" = ${itemName}
        group by f."businessId" 
      ) a join "SpecialFacility" b
      on a."businessId" = b."businessId"
    `) as SpecialFacilitiesInfo[];
  }

  async findManyByFacilityName(facilityName: string) {
    return (await this.prisma.$queryRaw`
      select
        a."businessId",
        b."name",
        b."cityCode",
        b."cityName",
        b."localCode",
        b."localName",
        b."address",
        b."detailAddress",
        a."items"
      from (
        select
          f."businessId",
          string_agg(distinct c."itemName", ',') as "items"
        from "SpecialFacility" f join "SpecialCourse" c
        on f."businessId" = c."businessId"
        where f."name" like ${`%${facilityName}%`}
        group by f."businessId" 
      ) a join "SpecialFacility" b
      on a."businessId" = b."businessId"
    `) as SpecialFacilitiesInfo[];
  }

  async findManyPopularByLocalCode(localCode: string) {
    const data = (await this.prisma.$queryRaw`
      select
        a."businessId",
        b."name",
        b."cityCode",
        b."cityName",
        b."localCode",
        b."localName",
        b."address",
        b."detailAddress",
        a."totalParticipantCount",
        a."items"
      from (
        select
          f."businessId",
          sum(ch."participantCount") as "totalParticipantCount",
          string_agg(distinct c."itemName", ',') as "items"
        from "SpecialFacility" f
          join "SpecialCourse" c
            on f."businessId" = c."businessId"
          join "SpecialCourseHistory" ch
            on f."businessId" = ch."businessId" and c."courseId" = ch."courseId"
        where f."localCode" = ${localCode}
        group by f."businessId"
      ) a join "SpecialFacility" b
        on a."businessId" = b."businessId"
      order by a."totalParticipantCount" desc
    `) as {
      businessId: string;
      name: string;
      cityCode: string;
      cityName: string;
      localCode: string;
      localName: string;
      address: string;
      detailAddress: string | null;
      totalParticipantCount: number;
      items: string;
    }[];

    return data.map((facility) => {
      return {
        ...facility,
        totalParticipantCount: Number(facility.totalParticipantCount),
        items: facility.items.split(','),
      };
    });
  }
}

export type SpecialFacilitiesInfo = {
  businessId: string;
  name: string;
  cityCode: string;
  cityName: string;
  localCode: string;
  localName: string;
  address: string;
  detailAddress: string | null;
  items: string;
};
