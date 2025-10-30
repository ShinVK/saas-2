import { prisma } from '@/lib/prisma'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { auth } from '@/http/middlewares/auth'
import { createSlug } from '@/lib/utils/create-slug'
import { getUserPermission } from '@/lib/utils/get-user-permissions'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { BadRequestError } from '../_errors/bad-request-error'
import { roleSchema } from '@saas/auth'

export async function getMembers(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/members/',
      {
        schema: {
          tags: ['member'],
          summary: 'Get all organization members',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              members: z.array(
                z.object({
                  userId: z.string(),
                  name: z.string().nullable(),
                  avatarUrl: z.url().nullable(),
                  email: z.string(),
                  id: z.string(),
                  role: roleSchema,
                })
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { slug } = request.params

        const { membership, organization } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermission(userId, membership.role)

        if (cannot('get', 'User')) {
          throw new UnauthorizedError(
            'You are not allowed to see organization members'
          )
        }

        const member = await prisma.member.findMany({
          where: {
            organizationId: organization.id,
          },
          select: {
            id: true,
            role: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: {
            role: 'asc',
          },
        })

        const membersWithRoles = member.map(
          ({ user: { id: userId, ...user }, ...member }) => {
            return {
              ...member,
              ...user,
              userId,
            }
          }
        )

        return reply.status(200).send({ members: membersWithRoles })
      }
    )
}
