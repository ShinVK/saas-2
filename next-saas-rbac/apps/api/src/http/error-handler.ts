import { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'
import { BadRequestError } from './routes/_errors/bad-request-error'
import { UnauthorizedError } from './routes/_errors/unauthorized-error'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  // Helpful debug log for development
  console.log('🚀 errorHandler:', error)

  // Handle runtime Zod errors (when validation is performed in code and throws ZodError)
  if (error instanceof ZodError) {
    const flattened = error.flatten()
    return reply.status(400).send({
      message: 'Validation Error',
      errors: flattened,
    })
  }

  // fastify-type-provider-zod/validatorCompiler may return Fastify validation errors
  // which are not instances of ZodError. Detect Fastify validation shape and return 400.
  const anyErr = error as any
  if (anyErr && anyErr.validation) {
    return reply.status(400).send({
      message: 'Validation Error',
      errors: anyErr.validation,
    })
  }

  // Some Zod integrations may wrap ZodError; also check common properties
  if (anyErr && Array.isArray(anyErr.issues)) {
    return reply.status(400).send({
      message: 'Validation Error',
      errors: anyErr.issues,
    })
  }

  if (error instanceof BadRequestError) {
    return reply.status(400).send({ message: error.message })
  }

  if (error instanceof UnauthorizedError) {
    return reply.status(401).send({ message: error.message })
  }

  // Default fallback
  return reply.status(500).send({ message: 'Internal server error' })
}
