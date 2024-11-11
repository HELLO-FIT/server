import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/request';
import { AccessTokenDto } from './dto/response';
import { JwtGuard } from 'src/common/guards';

@ApiTags('/auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: '카카오 로그인 - 최초 로그인시 회원가입 자동진행' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 201,
    description: '로그인 성공',
    type: AccessTokenDto,
  })
  @ApiResponse({ status: 401, description: '카카오 토큰이 유효하지 않음' })
  @Post('login')
  async login(@Body() { kakaoAccessToken }: LoginDto): Promise<AccessTokenDto> {
    return this.authService.login(kakaoAccessToken);
  }

  @ApiOperation({ summary: 'jwt 토큰 테스트 엔드포인트' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('test')
  test() {
    return 'success';
  }
}
