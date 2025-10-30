import { prisma } from '@/lib/prisma'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '@/http/middlewares/auth'
import { organizationSchema } from '@saas/auth'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { getUserPermission } from '@/lib/utils/get-user-permissions'

export async function shutDownOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug',
      {
        schema: {
          tags: ['organizations'],
          summary: 'Shutdown organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { slug } = request.params

        const { membership, organization } =
          await request.getUserMembership(slug)

        const authOrganization = organizationSchema.parse(organization)

        const { cannot } = getUserPermission(userId, membership.role)

        if (cannot('delete', authOrganization)) {
          throw new UnauthorizedError(
            "you're not allowed to shutdown this organization"
          )
        }

        await prisma.organization.delete({
          where: {
            id: organization.id,
          },
        })

        return reply.status(204).send()
      }
    )
}
