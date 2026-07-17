import { User } from '../../src/models';
import { UserRole } from '../../src/types/auth.types';

export const createUser = async (overrides = {}) => {
  const userData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: UserRole.CUSTOMER,
    isActive: true,
    isEmailVerified: true,
    ...overrides,
  };
  return await User.create(userData);
};

export const createAdmin = async (overrides = {}) => {
  return await createUser({
    email: 'admin@example.com',
    role: UserRole.ADMIN,
    ...overrides,
  });
};
