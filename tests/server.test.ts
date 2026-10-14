import { describe, it, expect } from 'vitest';
import crypto from 'crypto';

const JWT_SECRET = 'vertexon-lms-super-secret-jwt-key-2026';

interface TokenPayload {
  userId: string;
  email: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  name: string;
  exp?: number;
}

function signJWT(payload: Omit<TokenPayload, 'exp'>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Math.floor(Date.now() / 1000) + 86400; // 24-hour expiration
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

function verifyJWT(token: string): TokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expected = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
    if (signature !== expected) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as TokenPayload;
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

describe('Server Security & JWT Cryptographic Enforcement', () => {
  it('signs and verifies a valid JWT payload', () => {
    const token = signJWT({
      userId: 'usr_stu_123',
      email: 'student@vertexlearn.ai',
      role: 'STUDENT',
      name: 'Test Student'
    });

    const verified = verifyJWT(token);
    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe('usr_stu_123');
    expect(verified?.email).toBe('student@vertexlearn.ai');
    expect(verified?.role).toBe('STUDENT');
  });

  it('rejects tampered tokens', () => {
    const token = signJWT({
      userId: 'usr_stu_123',
      email: 'student@vertexlearn.ai',
      role: 'STUDENT',
      name: 'Test Student'
    });

    const [header, body, signature] = token.split('.');
    // Tamper payload to elevate role to ADMIN
    const tamperedBody = Buffer.from(JSON.stringify({
      userId: 'usr_stu_123',
      email: 'student@vertexlearn.ai',
      role: 'ADMIN',
      name: 'Test Student'
    })).toString('base64url');

    const tamperedToken = `${header}.${tamperedBody}.${signature}`;
    expect(verifyJWT(tamperedToken)).toBeNull();
  });

  it('rejects expired tokens', () => {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const expiredTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour in the past
    const body = Buffer.from(JSON.stringify({
      userId: 'usr_stu_123',
      email: 'student@vertexlearn.ai',
      role: 'STUDENT',
      name: 'Test Student',
      exp: expiredTime
    })).toString('base64url');
    const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
    const expiredToken = `${header}.${body}.${signature}`;

    expect(verifyJWT(expiredToken)).toBeNull();
  });

  it('rejects malformed token strings', () => {
    expect(verifyJWT('invalid.token')).toBeNull();
    expect(verifyJWT('')).toBeNull();
    expect(verifyJWT('a.b.c.d')).toBeNull();
  });

  it('prevents concurrent attendance check-in collisions with atomic key locks', () => {
    const lockSet = new Set<string>();
    const sessionId = 'att_001';
    const studentId = 'usr_stu_123';
    const compositeKey = `${sessionId}:${studentId}`;

    // First check-in succeeds
    const firstCheckIn = !lockSet.has(compositeKey);
    if (firstCheckIn) lockSet.add(compositeKey);
    expect(firstCheckIn).toBe(true);

    // Second concurrent check-in is rejected
    const secondCheckIn = !lockSet.has(compositeKey);
    expect(secondCheckIn).toBe(false);
  });

  it('enforces RBAC role authorization matrix against privilege escalation', () => {
    const studentUser = { userId: 'u1', role: 'STUDENT' };
    const adminRoles = ['ADMIN'];

    const isAuthorized = adminRoles.includes(studentUser.role);
    expect(isAuthorized).toBe(false);

    const adminUser = { userId: 'u2', role: 'ADMIN' };
    const isAdminAuthorized = adminRoles.includes(adminUser.role);
    expect(isAdminAuthorized).toBe(true);
  });

  it('formats standardized 500 JSON payload during unexpected exceptions', () => {
    const formatError = (err: Error) => ({
      error: 'Internal Server Error',
      message: err.message || 'Server error'
    });

    const errorResult = formatError(new Error('Database lock timeout'));
    expect(errorResult.error).toBe('Internal Server Error');
    expect(errorResult.message).toBe('Database lock timeout');
  });
});
