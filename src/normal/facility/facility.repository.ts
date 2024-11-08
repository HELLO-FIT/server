import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FacilityRepository {
  constructor(private prisma: PrismaService) {}

  async findManyByLocalCode(localCode: string) {
    return (await this.prisma.$queryRaw`
      select distinct
        f."businessId",
        f."serialNumber",
        f."name",
        f."cityCode",
        f."cityName",
        f."localCode",
        f."localName",
        f."address",
        f."detailAddress",
        f."owner"
      from "Facility" f join "Course" c
      on f."businessId" = c."businessId" and f."serialNumber" = c."facilitySerialNumber"
      where "localCode" = ${localCode};
    `) as FacilitiesInfo[];
  }

  async findManyByLocalCodeAndItemName(localCode: string, itemName: string) {
    return (await this.prisma.$queryRaw`
      select distinct
        f."businessId",
        f."serialNumber",
        f."name",
        f."cityCode",
        f."cityName",
        f."localCode",
        f."localName",
        f."address",
        f."detailAddress",
        f."owner"
      from "Facility" f join "Course" c
      on f."businessId" = c."businessId" and f."serialNumber" = c."facilitySerialNumber"
      where "localCode" = ${localCode} and c."itemName" = ${itemName};
    `) as FacilitiesInfo[];
  }

  async findManyByFacilityName(facilityName: string) {
    return (await this.prisma.$queryRaw`
      select distinct
        f."businessId",
        f."serialNumber",
        f."name",
        f."cityCode",
        f."cityName",
        f."localCode",
        f."localName",
        f."address",
        f."detailAddress",
        f."owner"
      from "Facility" f join "Course" c
      on f."businessId" = c."businessId" and f."serialNumber" = c."facilitySerialNumber"
      where f."name" like ${`%${facilityName}%`};
    `) as FacilitiesInfo[];
  }
}

export type FacilitiesInfo = {
  businessId: string;
  serialNumber: string;
  name: string;
  cityCode: string;
  cityName: string;
  localCode: string;
  localName: string;
  address: string;
  detailAddress: string | null;
  owner: string;
};
