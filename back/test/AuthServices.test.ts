import AuthServices from '../src/services/AuthServices';
import User from '../src/model/User';
import { generateToken, decodeToken } from '../src/utils/JWTUtils';
import mongoose from 'mongoose';

jest.mock('../src/model/User');
jest.mock('../src/utils/JWTUtils');

beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
});

describe('AuthServices', () => {
    const service = new AuthServices();

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('me', () => {
        it('should return user data if token is valid', async () => {
            const token = 'Bearer valid.token';
            const decoded = { email: 'test@example.com' };
            const user = {
                toObject: () => ({ email: decoded.email, name: 'Test User' }),
                select: jest.fn().mockReturnThis(),
            };

            (decodeToken as jest.Mock).mockReturnValue(decoded);
            (User.findOne as jest.Mock).mockReturnValue({
                select: jest.fn().mockReturnThis(),
                toObject: () => ({ email: decoded.email, name: 'Test User' }),
            });

            const res = await service.me(token);

            expect(res.success).toBe(true);
            expect(res.statusCode).toBe(200);
            expect(res.data.user!.email).toBe(decoded.email);
        });

        it('should fail if token is empty', async () => {
            const res = await service.me('');
            expect(res.success).toBe(false);
            expect(res.statusCode).toBe(500);
        });

        it('should fail if token format is invalid', async () => {
            const res = await service.me('invalidtoken');
            expect(res.success).toBe(false);
            expect(res.statusCode).toBe(500);
        });
    });

    describe('login', () => {
        it('should return token if credentials are valid', async () => {
            const email = 'test@example.com';
            const password = 'securepass';
            const token = 'generated.jwt.token';

            const user = {
                email,
                comparePassword: jest.fn().mockResolvedValue(true),
                save: jest.fn().mockResolvedValue(undefined),
            };

            (User.findOne as jest.Mock).mockResolvedValue(user);
            (generateToken as jest.Mock).mockReturnValue(token);

            const res = await service.login(email, password);

            expect(res.success).toBe(true);
            expect(res.statusCode).toBe(200);
            expect(res.data.token).toBe(token);
        });

        it('should fail if password is incorrect', async () => {
            const user = {
                comparePassword: jest.fn().mockResolvedValue(false),
            };

            (User.findOne as jest.Mock).mockResolvedValue(user);

            const res = await service.login('test@example.com', 'wrongpass');

            expect(res.success).toBe(false);
            expect(res.statusCode).toBe(401);
        });

        it('should fail if user not found', async () => {
            (User.findOne as jest.Mock).mockResolvedValue(null);

            const res = await service.login('unknown@example.com', 'pass');

            expect(res.success).toBe(false);
            expect(res.statusCode).toBe(401);
        });

        it('should fail if email or password is missing', async () => {
            const res = await service.login('', '');
            expect(res.success).toBe(false);
            expect(res.statusCode).toBe(400);
        });
    });

    describe('register', () => {
        it('should create a new user if email is not taken', async () => {
            const email = 'new@example.com';
            const password = 'newpass';
            const newUser = {
                toJSON: () => ({ email, isConfirmed: true }),
            };

            (User.findOne as jest.Mock).mockResolvedValue(null);
            (User.create as jest.Mock).mockResolvedValue(newUser);

            const res = await service.register(email, password);

            expect(res.success).toBe(true);
            expect(res.statusCode).toBe(201);
            expect(res.data.user!.email).toBe(email);
        });

        it('should fail if user already exists', async () => {
            (User.findOne as jest.Mock).mockResolvedValue({ email: 'existing@example.com' });

            const res = await service.register('existing@example.com', 'pass');

            expect(res.success).toBe(false);
            expect(res.statusCode).toBe(409);
        });

        it('should fail if email or password is missing', async () => {
            const res = await service.register('', '');
            expect(res.success).toBe(false);
            expect(res.statusCode).toBe(400);
        });
    });
});
