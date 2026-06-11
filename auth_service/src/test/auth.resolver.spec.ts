import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from '../auth/auth.resolver';
import { AuthService } from '../auth/auth.service';
import { SignupInput } from '../auth/dto/signup.input';
import { LoginInput } from '../auth/dto/login.input';
import { Token } from '../auth/models/token.model';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: AuthService;

  const authServiceMock = {
    createUser: jest.fn(),
    login: jest.fn(),
    refreshToken: jest.fn(),
    validateToken: jest.fn(),
    getUserFromToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should signup user and return tokens', async () => {
    const payload: SignupInput = { email: 'test@mail.com', password: '123' };
    const token: Token = { accessToken: 'access', refreshToken: 'refresh' };

    authServiceMock.createUser.mockResolvedValue(token);

    const result = await resolver.signup(payload);

    expect(authService.createUser).toHaveBeenCalledWith({
      email: 'test@mail.com',
      password: '123',
    });
    expect(result).toEqual(token);
  });

  it('should login user and return tokens', async () => {
    const payload: LoginInput = { email: 'test@mail.com', password: '123' };
    const token: Token = { accessToken: 'access', refreshToken: 'refresh' };

    authServiceMock.login.mockResolvedValue(token);

    const result = await resolver.login(payload);

    expect(authService.login).toHaveBeenCalledWith('test@mail.com', '123');
    expect(result).toEqual(token);
  });

  it('should refresh token', async () => {
    const token: Token = { accessToken: 'access', refreshToken: 'refresh' };
    authServiceMock.refreshToken.mockResolvedValue(token);

    const result = await resolver.refreshToken('refresh-token');

    expect(authService.refreshToken).toHaveBeenCalledWith('refresh-token');
    expect(result).toEqual(token);
  });

  it('should validate token and return user', async () => {
    const user = { id: '1', email: 'test@mail.com' };
    authServiceMock.validateToken.mockResolvedValue(user);

    const result = await resolver.validateToken('token');

    expect(authService.validateToken).toHaveBeenCalledWith('token');
    expect(result).toEqual(user);
  });

  it('should resolve user field from auth', async () => {
    const user = { id: '1', email: 'test@mail.com' };
    authServiceMock.getUserFromToken.mockResolvedValue(user);

    const auth = { accessToken: 'access' } as any;

    const result = await resolver.user(auth);

    expect(authService.getUserFromToken).toHaveBeenCalledWith('access');
    expect(result).toEqual(user);
  });
});