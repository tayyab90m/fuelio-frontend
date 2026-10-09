import { loginSchema, registerSchema } from './index';

const valid = { name: 'Ada', email: 'ada@example.com', password: 'Password123!', confirmPassword: 'Password123!' };

describe('registerSchema', () => {
  it('accepts a valid sign-up', async () => {
    await expect(registerSchema.isValid(valid)).resolves.toBe(true);
  });

  it('requires 8+ character passwords, matching the backend rule', async () => {
    await expect(registerSchema.isValid({ ...valid, password: 'short', confirmPassword: 'short' })).resolves.toBe(false);
  });

  it('requires the confirmation to match', async () => {
    await expect(registerSchema.isValid({ ...valid, confirmPassword: 'Different123!' })).resolves.toBe(false);
  });

  it('rejects a blank name and an invalid email', async () => {
    await expect(registerSchema.isValid({ ...valid, name: '   ' })).resolves.toBe(false);
    await expect(registerSchema.isValid({ ...valid, email: 'nope' })).resolves.toBe(false);
  });
});

describe('loginSchema', () => {
  it('requires an email and a password', async () => {
    await expect(loginSchema.isValid({ email: 'ada@example.com', password: 'Password123!' })).resolves.toBe(true);
    await expect(loginSchema.isValid({ email: '', password: '' })).resolves.toBe(false);
  });
});
