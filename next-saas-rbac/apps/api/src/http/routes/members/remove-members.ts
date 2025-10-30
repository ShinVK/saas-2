import { prisma } from '@/lib/prisma'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { auth } from '@/http/middlewares/auth'
import { createSlug } from '@/lib/utils/create-slug'
import { getUserPermission } from '@/lib/utils/get-user-permissions'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { roleSchema } from '@saas/auth'

export async function removeMember(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug/members/:memberId',
      {
        schema: {
          tags: ['member'],
          summary: 'Remove a member from the organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            memberId: z.uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { slug, memberId } = request.params

        const { membership, organization } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermission(userId, membership.role)

        if (cannot('delete', 'User')) {
          throw new UnauthorizedError(
            'You are not allowed to remove this member from the organization'
          )
        }

        await prisma.member.delete({
          where: {
            id: memberId,
            organizationId: organization.id,
          },
        })

        return reply.status(204).send()
      }
    )
}
