import { FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../utils/errors';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
  } catch (error) {
    throw new AppError('Unauthorized', 401);
  }
}

export async function requireAdmin(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
    const user = request.user as any;
    
    if (user.role !== 'ADMIN') {
      throw new AppError('Forbidden: Admin access required', 403);
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Unauthorized', 401);
  }
}
