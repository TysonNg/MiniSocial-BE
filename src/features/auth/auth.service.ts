import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { KeyStoreEntity } from '../keystore/entities/keystore.entity';
import { KeyStoreService } from '../keystore/keystore.service';
import { RedisService } from 'src/redis/redis.service';
import { SignUpDto } from './dto/signup';
import { SignInInterface, SignUpInterface } from 'src/interfaces';
import { generateKeyPairSync } from 'crypto';
import * as bcrypt from 'bcrypt';
import { generateTokenPair } from 'src/ultils/auth.ultils';
import { SignInDto } from './dto/signin';
import { KeyStoreInterface } from 'src/interfaces/keystore.interface';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(KeyStoreEntity)
    private keyStoreRepository: Repository<KeyStoreEntity>,

    private keyStoreService: KeyStoreService,
    private redisService: RedisService,
  ) {}

  //SignUp
  async signUp(payload: SignUpDto): Promise<SignUpInterface> {
    const { email, password, name } = payload;
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) throw new ConflictException('User already registed!!!');

    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      email,
      name,
      password: passwordHash,
    });
    await this.userRepository.save(newUser);
    const tokens = generateTokenPair(newUser, privateKey);
    const { access_token, refresh_token } = tokens;
    await this.keyStoreService.createKeyToken({
      accessToken: access_token,
      refreshToken: refresh_token,
      privateKey,
      publicKey,
      userId: newUser.id,
    });
    await this.redisService.set(
      `keystore:${newUser.id}`,
      JSON.stringify({
        userId: newUser.id,
        accessToken: access_token,
        refreshToken: refresh_token,
        publicKey,
        refreshTokenUsed: [],
      }),
    );
    await this.redisService.get(`keystore:${newUser.id}`);

    return {
      user: {
        name,
        email,
        id: newUser.id,
      },
      tokens,
    };
  }

  //SignIn
  async signIn(payload: SignInDto): Promise<SignInInterface> {
    const { email, password } = payload;
    const foundUser = await this.userRepository.findOne({ where: { email } });
    if (!foundUser) throw new NotFoundException('Pls check email or password');

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) throw new BadRequestException('Pls check email or password');

    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    const { id } = foundUser;
    const tokens = generateTokenPair({ id, email }, privateKey);
    await this.keyStoreService.createKeyToken({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      privateKey,
      publicKey,
      userId: id,
    });
    const getKeyStoreRedis = await this.redisService.get(`keystore:${id}`);
    if (getKeyStoreRedis) {
      const keyStore: KeyStoreInterface = JSON.parse(getKeyStoreRedis ?? '');

      keyStore.accessToken = tokens.access_token;
      keyStore.refreshToken = tokens.refresh_token;
      await this.redisService.set(`keystore:${id}`, JSON.stringify(keyStore));
      return {
        user: {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
        },
        tokens,
      };
    }
    await this.redisService.set(
      `keystore:${id}`,
      JSON.stringify({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        publicKey,
        refreshTokenUsed: [],
        userId: id,
      }),
    );
    return {
      user: {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
      },
      tokens,
    };
  }

  //Logout
  async logout(@Req() req: Request) {
    const user = (req as any).user;
    const keystore = await this.keyStoreService.findByUserId(user.id);
    if (!keystore) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    await this.keyStoreRepository.delete({ id: keystore.id });
    return { message: 'Logged out successfully' };
  }

  //Refresh TOken
  async refreshToken(refreshToken: string) {
    const foundToken =
      await this.keyStoreService.findByRefreshTokenUsed(refreshToken);

    if (foundToken) {
      await this.keyStoreRepository.delete({ id: foundToken.id });
      throw new UnauthorizedException('Failed to authorize! Pls relogin!');
    }
    const keyStore =
      await this.keyStoreService.findByRefreshToken(refreshToken);
    if (!keyStore) throw new NotFoundException('NotFound KeyStore!!');

    const decodedUser = await verify(refreshToken, keyStore.privateKey, {
      algorithms: ['RS256'],
    });

    const { id, email } = decodedUser as { id: string; email: string };
    const newTokens = generateTokenPair({ id, email }, keyStore.privateKey);
    await this.keyStoreRepository.update(keyStore.id, {
      accessToken: newTokens.access_token,
      refreshToken: newTokens.refresh_token,
      refreshTokenUsed: [...keyStore.refreshTokenUsed, refreshToken],
    });
    const store = await this.keyStoreRepository.findOne({
      where: { id: keyStore.id },
    });

    return {
      refreshToken: store?.refreshToken,
      accessToken: store?.accessToken,
    };
  }
}
