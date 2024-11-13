import { Injectable, HttpException } from '@nestjs/common';
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

  async findManyByLocalCodeAndType(localCode: string, type: string) {
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
        where "localCode" = ${localCode} and c."type" = ${type}
        group by f."businessId" 
      ) a join "SpecialFacility" b
      on a."businessId" = b."businessId"
    `) as SpecialFacilitiesInfo[];
  }

  async findManyByLocalCodeAndItemNameAndType(
    localCode: string,
    itemName: string,
    type: string,
  ) {
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
        where "localCode" = ${localCode} and c."itemName" = ${itemName} and c."type" = ${type}
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
    `) as PopularSpecialFacilitiesInfo[];

    return data.map((facility) => {
      return {
        ...facility,
        totalParticipantCount: Number(facility.totalParticipantCount),
        items: facility.items.split(','),
      };
    });
  }

  async findManyPopularByLocalCodeAndType(localCode: string, type: string) {
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
        where f."localCode" = ${localCode} and c."type" = ${type}
        group by f."businessId"
      ) a join "SpecialFacility" b
        on a."businessId" = b."businessId"
      order by a."totalParticipantCount" desc
    `) as PopularSpecialFacilitiesInfo[];

    return data.map((facility) => {
      return {
        ...facility,
        totalParticipantCount: Number(facility.totalParticipantCount),
        items: facility.items.split(','),
      };
    });
  }

  async findOne(businessId: string) {
    const facility = await this.prisma.specialFacility.findUnique({
      where: { businessId },
    });
    if (!facility) {
      throw new HttpException('시설이 존재하지 않습니다.', 404);
    }
    return facility;
  }

  async toggleFavorite(userId: string, businessId: string) {
    const favorite = await this.prisma.specialFavorite.findUnique({
      where: { userId_businessId: { userId, businessId } },
    });

    if (favorite) {
      await this.prisma.specialFavorite.delete({
        where: { userId_businessId: { userId, businessId } },
      });
    } else {
      await this.prisma.specialFavorite.create({
        data: { userId, businessId },
      });
    }

    return;
  }

  async isFavorite(userId: string, businessId: string) {
    const favorite = await this.prisma.specialFavorite.findUnique({
      where: { userId_businessId: { userId, businessId } },
    });

    return !!favorite;
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

export type PopularSpecialFacilitiesInfo = {
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
};
