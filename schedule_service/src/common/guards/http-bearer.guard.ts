import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class HttpBearerGuard implements CanActivate {
  private logger = new Logger(HttpBearerGuard.name);

  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Convert to graphql context
    const gqlCtx = GqlExecutionContext.create(context);
    const { req } = gqlCtx.getContext();

    // Extract token from authorization header
    const authHeader = req.headers?.authorization || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;

    if (!token) {
      throw new UnauthorizedException('Missing authorization token');
    }

    try {
      // Call validate token
      const authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL');
      if (!authServiceUrl) {
        this.logger.error('AUTH_SERVICE_URL not configured');
        throw new HttpException(
          'Auth service not available',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      // GraphQL query to validate token from auth service
      const query = `
        query ValidateToken($token: String!) {
          validateToken(token: $token) {
            id
            email
            createdAt
          }
        }
      `;

      const response = await axios.post(authServiceUrl, {
        query,
        variables: { token },
      });

      // Check for graphql errors
      if (response.data.errors) {
        this.logger.error('Token validation failed from auth service', response.data.errors);
        throw new UnauthorizedException('Invalid token');
      }

      // Attach user to context
      const user = response.data.data?.validateToken;
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      req.user = user;
      return true;
    } catch (error: any) {
      this.logger.error('Auth validation error', error.message);

      if (error instanceof UnauthorizedException || error instanceof HttpException) {
        throw error;
      }

      throw new UnauthorizedException('Token validation failed');
    }
  }
}
