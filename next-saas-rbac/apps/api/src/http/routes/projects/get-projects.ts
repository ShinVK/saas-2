import { prisma } from '@/lib/prisma'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { auth } from '@/http/middlewares/auth'
import { createSlug } from '@/lib/utils/create-slug'
import { getUserPermission } from '@/lib/utils/get-user-permissions'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { BadRequestError } from '../_errors/bad-request-error'

export async function getProjects(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/projects',
      {
        schema: {
          tags: ['projects'],
          summary: 'Get all organization projects',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              projects: z.array(
                z.object({
                  name: z.string(),
                  id: z.uuid(),
                  slug: z.string(),
                  avatarUrl: z.string().nullable(),
                  ownerId: z.uuid(),
                  organizationId: z.uuid(),
                  description: z.string().nullable(),
                  createdAt: z.date(),
                  owner: z.object({
                    name: z.string().nullable(),
                    id: z.uuid(),
                    avatarUrl: z.string().nullable(),
                  }),
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

        if (cannot('get', 'Project')) {
          throw new UnauthorizedError('You are not allowed to see this project')
        }

        const projects = await prisma.project.findMany({
          where: {
            organizationId: organization.id,
          },
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            name: true,
            description: true,
            slug: true,
            ownerId: true,
            avatarUrl: true,
            organizationId: true,
            createdAt: true,
            owner: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        })

        return reply.status(200).send({ projects })
      }
    )
}
