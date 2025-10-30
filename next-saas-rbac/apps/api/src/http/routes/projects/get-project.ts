import { prisma } from '@/lib/prisma'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { auth } from '@/http/middlewares/auth'
import { getUserPermission } from '@/lib/utils/get-user-permissions'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { BadRequestError } from '../_errors/bad-request-error'

export async function getProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:orgSlug/projects/:projectSlug',
      {
        schema: {
          tags: ['projects'],
          summary: 'Get project by slug',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            projectSlug: z.uuid(),
          }),
          response: {
            200: z.object({
              project: z.object({
                name: z.string(),
                id: z.uuid(),
                slug: z.string(),
                avatarUrl: z.string().nullable(),
                ownerId: z.uuid(),
                organizationId: z.uuid(),
                description: z.string().nullable(),
                owner: z.object({
                  name: z.string().nullable(),
                  id: z.uuid(),
                  avatarUrl: z.string().nullable(),
                }),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { projectSlug, orgSlug } = request.params

        const { membership, organization } =
          await request.getUserMembership(orgSlug)

        const { cannot } = getUserPermission(userId, membership.role)

        if (cannot('get', 'Project')) {
          throw new UnauthorizedError('You are not allowed to see this project')
        }

        const project = await prisma.project.findUnique({
          where: {
            slug: projectSlug,
            organizationId: organization.id,
          },
          select: {
            id: true,
            name: true,
            description: true,
            slug: true,
            ownerId: true,
            avatarUrl: true,
            organizationId: true,
            owner: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        })

        if (!project) {
          throw new BadRequestError('Project not found')
        }

        return reply.status(200).send({ project })
      }
    )
}
