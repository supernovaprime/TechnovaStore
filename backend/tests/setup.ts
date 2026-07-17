import { connectTestDatabase, disconnectTestDatabase, clearDatabase } from './config/database';
import jwt from 'jsonwebtoken';

beforeAll(async () => {
  await connectTestDatabase();
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await disconnectTestDatabase();
});

export const generateTestToken = (userId: string, role: string) => {
  return jwt.sign(
    { userId, email: 'test@example.com', role },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );
};
