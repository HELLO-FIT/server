import { Controller, Delete, UseGuards, HttpCode, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtGuard } from 'src/common/guards';
import { CurrentUser } from 'src/common/decorators';
import { FavoriteFacilitiesDto, MyProfileDto } from './dto/response';

@ApiTags('/users')
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Unauthorized' })
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '회원 탈퇴' })
  @ApiResponse({ status: 204, description: '회원 탈퇴 성공' })
  @Delete('me')
  @UseGuards(JwtGuard)
  @HttpCode(204)
  async deleteUser(@CurrentUser() userId: string) {
    await this.userService.deleteUser(userId);
  }

  @ApiOperation({ summary: '내 계정 정보 조회' })
  @ApiResponse({
    status: 200,
    description: '내 계정 정보 조회 성공',
    type: MyProfileDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get('me')
  @UseGuards(JwtGuard)
  async getMe(@CurrentUser() userId: string): Promise<MyProfileDto> {
    return await this.userService.getMe(userId);
  }

  @ApiOperation({ summary: '찜 시설 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '찜 시설 목록 조회 성공',
    type: FavoriteFacilitiesDto,
    isArray: true,
  })
  @Get('favorites')
  @UseGuards(JwtGuard)
  async getFavorites(
    @CurrentUser() userId: string,
  ): Promise<FavoriteFacilitiesDto[]> {
    return await this.userService.getFavorites(userId);
  }
}
