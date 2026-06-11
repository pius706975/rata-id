import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from 'nestjs-prisma';
import { PasswordService } from '../auth/password.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  ConflictException,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;

  const prismaMock = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const passwordMock = {
    hashPassword: jest.fn(),
    validatePassword: jest.fn(),
  };

  const jwtMock = {
    sign: jest.fn(),
    verify: jest.fn(),
    decode: jest.fn(),
  };

  const configMock = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: PasswordService, useValue: passwordMock },
        { provide: JwtService, useValue: jwtMock },
        { provide: ConfigService, useValue: configMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create user and return tokens', async () => {
      passwordMock.hashPassword.mockResolvedValue('hashed');
      prismaMock.user.create.mockResolvedValue({
        id: '1',
        email: 'a@mail.com',
      });

      jwtMock.sign.mockReturnValue('access-token');

      configMock.get.mockImplementation((key) => {
        if (key === 'security') return { refreshIn: '7d' };
        if (key === 'JWT_REFRESH_SECRET') return 'refresh-secret';
      });

      const result = await service.createUser({
        email: 'a@mail.com',
        password: '123',
      } as any);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw ConflictException when email exists', async () => {
      passwordMock.hashPassword.mockResolvedValue('hashed');

      prismaMock.user.create.mockRejectedValue(
        Object.assign(
          new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
            code: 'P2002',
            clientVersion: '3.0.0',
          }),
          {},
        ),
      );

      await expect(
        service.createUser({ email: 'a@mail.com', password: '123' } as any),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should throw NotFoundException if user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(service.login('a@mail.com', '123')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if password invalid', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'a@mail.com',
        password: 'hashed',
      });

      passwordMock.validatePassword.mockResolvedValue(false);

      await expect(service.login('a@mail.com', '123')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return tokens if login success', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'a@mail.com',
        password: 'hashed',
      });

      passwordMock.validatePassword.mockResolvedValue(true);

      jwtMock.sign.mockReturnValue('token');

      configMock.get.mockImplementation((key) => {
        if (key === 'security') return { refreshIn: '7d' };
        if (key === 'JWT_REFRESH_SECRET') return 'refresh-secret';
      });

      const result = await service.login('a@mail.com', '123');

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });
  });

  describe('validateToken', () => {
    it('should return user if token valid', async () => {
      jwtMock.verify.mockReturnValue({ userId: '1' });

      prismaMock.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'a@mail.com',
      });

      const result = await service.validateToken('token');

      expect(result.id).toBe('1');
    });

    it('should throw UnauthorizedException if invalid', async () => {
      jwtMock.verify.mockImplementation(() => {
        throw new Error();
      });

      await expect(service.validateToken('bad')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('refreshToken', () => {
    it('should return new tokens', () => {
      jwtMock.verify.mockReturnValue({ userId: '1' });
      jwtMock.sign.mockReturnValue('new-token');

      configMock.get.mockImplementation((key) => {
        if (key === 'security') return { refreshIn: '7d' };
        if (key === 'JWT_REFRESH_SECRET') return 'refresh-secret';
      });

      const result = service.refreshToken('token');

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should throw UnauthorizedException if invalid token', () => {
      jwtMock.verify.mockImplementation(() => {
        throw new Error();
      });

      expect(() => service.refreshToken('bad')).toThrow(UnauthorizedException);
    });
  });

  describe('getUserFromToken', () => {
    it('should return user from decoded token', async () => {
      jwtMock.decode.mockReturnValue({ userId: '1' });

      prismaMock.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'a@mail.com',
      });

      const result = await service.getUserFromToken('token');

      expect(result.id).toBe('1');
    });
  });
});
