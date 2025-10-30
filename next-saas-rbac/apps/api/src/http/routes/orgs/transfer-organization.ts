import { prisma } from '@/lib/prisma'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '@/http/middlewares/auth'
import { organizationSchema, userSchema, defineAbilityFor } from '@saas/auth'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { getUserPermission } from '@/lib/utils/get-user-permissions'

export async function transferOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/organizations/:slug/owner',
      {
        schema: {
          tags: ['organizations'],
          summary: 'Transfer organization ownership',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            transferToUserId: z.uuid(),
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

        if (cannot('transfer_ownership', authOrganization)) {
          throw new UnauthorizedError(
            "you're not allowed to transfer this organization"
          )
        }

        const { transferToUserId } = request.body

        const transferToMembership = await prisma.member.findUnique({
          where: {
            userId_organizationId: {
              organizationId: organization.id,
              userId: transferToUserId,
            },
          },
        })

        if (!transferToMembership) {
          throw new BadRequestError(
            `Target user is not a member of this organization`
          )
        }

        await prisma.$transaction([
          prisma.member.update({
            where: {
              userId_organizationId: {
                organizationId: organization.id,
                userId: transferToUserId,
              },
            },
            data: {
              role: 'ADMIN',
            },
          }),
          prisma.organization.update({
            where: {
              id: organization.id,
            },
            data: {
              ownerId: transferToUserId,
            },
          }),
        ])
        return reply.status(204).send()
      }
    )
}
