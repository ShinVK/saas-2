import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { roleSchema } from '@saas/auth'

export async function getOrganizations(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations',
      {
        schema: {
          tags: ['organizations'],
          summary: 'Get organization where user is a member',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              organizations: z.array(
                z.object({
                  id: z.string(),
                  name: z.string(),
                  slug: z.string(),
                  avatarUrl: z.string().nullable(),
                  role: roleSchema,
                })
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const organizations = await prisma.organization.findMany({
          select: {
            id: true,
            name: true,
            slug: true,
            avatarUrl: true,
            members: {
              select: {
                role: true,
              },
              where: {
                userId,
              },
            },
          },
          where: {
            members: {
              some: {
                userId,
              },
            },
          },
        })

        const organizationWithUserRole = organizations.map(
          ({ members, ...org }) => ({
            ...org,
            role: members[0].role,
          })
        )

        return { organizations: organizationWithUserRole }
      }
    )
}
