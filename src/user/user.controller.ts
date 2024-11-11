import { Controller, Delete, UseGuards, HttpCode } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtGuard } from 'src/common/guards';
import { CurrentUser } from 'src/common/decorators';

@ApiTags('/users')
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Unauthorized' })
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '회원 탈퇴' })
  @ApiResponse({ status: 204, description: '회원 탈퇴 성공' })
  @Delete()
  @UseGuards(JwtGuard)
  @HttpCode(204)
  async deleteUser(@CurrentUser() userId: string) {
    await this.userService.deleteUser(userId);
  }
}
