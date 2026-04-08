import { FastifyReply, FastifyRequest } from 'fastify';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      error: {
        message: error.message,
        statusCode: error.statusCode,
      },
    });
  }

  // Log unexpected errors
  console.error('Unexpected error:', error);

  return reply.status(500).send({
    error: {
      message: 'Internal server error',
      statusCode: 500,
    },
  });
}
