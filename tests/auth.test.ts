import { describe, it, expect, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';
import { AuthenticationService, DEFAULT_CREDENTIALS } from '../src/services/authService';

// Polyfill minimal localStorage for Node environment if missing
if (typeof globalThis.localStorage === 'undefined') {
  const store: Record<string, string> = {};
  globalThis.localStorage = {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, val: string) => { store[key] = String(val); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); },
    length: 0,
    key: () => null
  } as Storage;
}

describe('Authentication & Bcrypt Hashing Compliance', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('bcrypt Hashing', () => {
    it('hashes passwords into secure bcrypt strings ($2a$ or $2b$ prefix)', async () => {
      const rawPassword = 'StudentSecret@2026';
      const hash = await AuthenticationService.hashPassword(rawPassword);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      // Must start with standard bcrypt format
      expect(hash).toMatch(/^\$2[aby]\$\d{2}\$/);
      // Hash must never equal the plain text password
      expect(hash).not.toBe(rawPassword);
    });

    it('successfully verifies a matching password against its bcrypt hash', async () => {
      const password = 'CorrectPassword#42';
      const hash = await AuthenticationService.hashPassword(password);

      const isValid = await AuthenticationService.comparePassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('rejects an incorrect password when compared to the bcrypt hash', async () => {
      const password = 'CorrectPassword#42';
      const wrongPassword = 'WrongPassword#99';
      const hash = await AuthenticationService.hashPassword(password);

      const isValid = await AuthenticationService.comparePassword(wrongPassword, hash);
      expect(isValid).toBe(false);
    });

    it('generates distinct bcrypt hashes for the same password due to random salt rounds', async () => {
      const password = 'InstitutionalPassword@2026';
      const hash1 = await AuthenticationService.hashPassword(password);
      const hash2 = await AuthenticationService.hashPassword(password);

      expect(hash1).not.toBe(hash2);
      expect(await AuthenticationService.comparePassword(password, hash1)).toBe(true);
      expect(await AuthenticationService.comparePassword(password, hash2)).toBe(true);
    });
  });

  describe('Stored Default Credentials Verification', () => {
    it('verifies student default credentials using bcrypt', async () => {
      const studentCred = DEFAULT_CREDENTIALS['student@vertexlearn.ai'];
      expect(studentCred).toBeDefined();
      expect(studentCred.role).toBe('STUDENT');
      expect(studentCred.passwordHash).toMatch(/^\$2[aby]\$\d{2}\$/);

      const result = await AuthenticationService.verifyCredentials('student@vertexlearn.ai', 'Student@2026');
      expect(result.success).toBe(true);
      expect(result.credential?.userId).toBe('usr_stu_001');
    });

    it('verifies instructor default credentials using bcrypt', async () => {
      const result = await AuthenticationService.verifyCredentials('instructor@vertexlearn.ai', 'Faculty@2026');
      expect(result.success).toBe(true);
      expect(result.credential?.role).toBe('INSTRUCTOR');
    });

    it('verifies admin default credentials using bcrypt', async () => {
      const result = await AuthenticationService.verifyCredentials('admin@vertexon.ai', 'Admin@2026');
      expect(result.success).toBe(true);
      expect(result.credential?.role).toBe('ADMIN');
    });

    it('rejects authentication with invalid password', async () => {
      const result = await AuthenticationService.verifyCredentials('student@vertexlearn.ai', 'WrongSecret123');
      expect(result.success).toBe(false);
      expect(result.message).toContain('Invalid password');
    });

    it('rejects authentication for non-existent account with appropriate message', async () => {
      const result = await AuthenticationService.verifyCredentials('unknown@nonexistent.org', 'AnyPass123');
      expect(result.success).toBe(false);
      expect(result.notFound).toBe(true);
      expect(result.message).toContain('Candidate account not found');
    });
  });

  describe('Candidate Registration & Bcrypt Persistence', () => {
    it('hashes candidate password with bcrypt and allows subsequent verification', async () => {
      const email = 'new.candidate@vertexlearn.ai';
      const rawPassword = 'NewStudent@2026!';
      const stored = await AuthenticationService.storeCandidateCredentials(
        email,
        rawPassword,
        'STUDENT',
        'usr_stu_test_99'
      );

      expect(stored.passwordHash).toMatch(/^\$2[aby]\$\d{2}\$/);

      // Verify the new candidate can log in
      const authResult = await AuthenticationService.verifyCredentials(email, rawPassword);
      expect(authResult.success).toBe(true);
      expect(authResult.credential?.userId).toBe('usr_stu_test_99');

      // Verify incorrect password fails
      const failedResult = await AuthenticationService.verifyCredentials(email, 'BadPassword');
      expect(failedResult.success).toBe(false);
    });

    it('updates candidate password with a new bcrypt hash', async () => {
      const email = 'student@vertexlearn.ai';
      const updated = await AuthenticationService.updatePasswordWithBcrypt(email, 'NewUpdatedPass@2026');
      expect(updated).toBe(true);

      // Old password must fail
      const oldVerify = await AuthenticationService.verifyCredentials(email, 'Student@2026');
      expect(oldVerify.success).toBe(false);

      // New password must succeed
      const newVerify = await AuthenticationService.verifyCredentials(email, 'NewUpdatedPass@2026');
      expect(newVerify.success).toBe(true);
    });
  });

  describe('Session Token Generation', () => {
    it('generates unique cryptographic session tokens', () => {
      const token1 = AuthenticationService.generateSessionToken();
      const token2 = AuthenticationService.generateSessionToken();

      expect(token1).toMatch(/^jwt_sec_\d+_/);
      expect(token1).not.toBe(token2);
    });
  });
});
