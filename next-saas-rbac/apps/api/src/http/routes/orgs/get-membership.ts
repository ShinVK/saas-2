import { prisma } from '@/lib/prisma'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '@/http/middlewares/auth'
import { createSlug } from '@/lib/utils/create-slug'
import { roleSchema } from '@saas/auth'

export async function getMembership(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/membership',
      {
        schema: {
          tags: ['organizations'],
          summary: 'Get organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              membership: z.object({
                id: z.uuid(),
                role: roleSchema,
                userId: z.uuid(),
                organizationId: z.uuid(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { membership } = await request.getUserMembership(slug)

        return reply.status(200).send({
          membership: {
            id: membership.id,
            role: roleSchema.parse(membership.role),
            organizationId: membership.organizationId,
            userId: membership.userId,
          },
        })
      }
    )
}
