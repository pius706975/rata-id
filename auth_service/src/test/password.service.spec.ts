import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from '../auth/password.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { SecurityConfig } from '../common/configs/config.interface';

describe('PasswordService', () => {
  let service: PasswordService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService, ConfigService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
    configService = module.get<ConfigService>(ConfigService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('bcryptSaltRounds getter', () => {
    it('should return number if config is integer string', () => {
      jest.spyOn(configService, 'get').mockReturnValue({
        bcryptSaltOrRound: '12',
      } as SecurityConfig);

      expect(service.bcryptSaltRounds).toBe(12);
    });

    it('should return string if config is not a number', () => {
      jest.spyOn(configService, 'get').mockReturnValue({
        bcryptSaltOrRound: 'salt',
      } as SecurityConfig);

      expect(service.bcryptSaltRounds).toBe('salt');
    });
  });

  describe('hashPassword', () => {
    it('should hash password using bcrypt', async () => {
      jest.spyOn(configService, 'get').mockReturnValue({
        bcryptSaltOrRound: 10,
      } as SecurityConfig);

      const hashSpy = jest.spyOn(bcrypt, 'hash');

      const hashed = await service.hashPassword('mypassword');

      expect(hashSpy).toHaveBeenCalledWith('mypassword', 10);
      expect(hashed).toBeDefined();
    });
  });

  describe('validatePassword', () => {
    it('should validate correct password', async () => {
      const compareSpy = jest.spyOn(bcrypt, 'compare');

      await service.validatePassword('mypassword', 'hashedpass');

      expect(compareSpy).toHaveBeenCalledWith('mypassword', 'hashedpass');
    });
  });
});