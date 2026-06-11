import { HttpBearerGuard } from '../../../common/guards/http-bearer.guard';
import { ConfigService } from '@nestjs/config';
import {
  ExecutionContext,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import axios from 'axios';
import { Logger } from '@nestjs/common';

jest.mock('axios');

describe('HttpBearerGuard', () => {
  let guard: HttpBearerGuard;
  let configService: ConfigService;
  let context: Partial<ExecutionContext>;

  const mockReq: any = { headers: {} };

  beforeAll(() => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  beforeEach(() => {
    configService = {
      get: jest.fn().mockReturnValue('http://auth-service/graphql'),
    } as any;

    guard = new HttpBearerGuard(configService);

    context = {} as any;

    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue({
      getContext: () => ({ req: mockReq }),
    } as any);
  });

  it('should throw UnauthorizedException if no token', async () => {
    mockReq.headers = {};
    await expect(
      guard.canActivate(context as ExecutionContext),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw error if AUTH_SERVICE_URL not configured', async () => {
    (configService.get as jest.Mock).mockReturnValue(null);
    mockReq.headers = { authorization: 'Bearer valid-token' };
    await expect(
      guard.canActivate(context as ExecutionContext),
    ).rejects.toThrow(HttpException);
  });

  it('should throw UnauthorizedException if auth service returns error', async () => {
    mockReq.headers = { authorization: 'Bearer valid-token' };
    (axios.post as jest.Mock).mockResolvedValue({
      data: { errors: ['Invalid token'] },
    });

    await expect(
      guard.canActivate(context as ExecutionContext),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should attach user to request if token is valid', async () => {
    const user = { id: '1', email: 'test@test.com', createdAt: '2023-01-01' };
    mockReq.headers = { authorization: 'Bearer valid-token' };

    (axios.post as jest.Mock).mockResolvedValue({
      data: { data: { validateToken: user } },
    });

    const result = await guard.canActivate(context as ExecutionContext);
    expect(result).toBe(true);
    expect(mockReq.user).toEqual(user);
  });

  it('should throw UnauthorizedException if axios throws unknown error', async () => {
    mockReq.headers = { authorization: 'Bearer valid-token' };

    (axios.post as jest.Mock).mockRejectedValue(new Error('Network error'));

    await expect(
      guard.canActivate(context as ExecutionContext),
    ).rejects.toThrow(UnauthorizedException);
  });
});
