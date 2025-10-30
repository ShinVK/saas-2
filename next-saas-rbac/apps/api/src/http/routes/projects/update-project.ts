import { prisma } from '@/lib/prisma'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { auth } from '@/http/middlewares/auth'
import { createSlug } from '@/lib/utils/create-slug'
import { getUserPermission } from '@/lib/utils/get-user-permissions'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { projectSchema } from '@saas/auth'
import { BadRequestError } from '../_errors/bad-request-error'

export async function updateProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug/projects/:projectId',
      {
        schema: {
          tags: ['projects'],
          summary: 'Create a new project',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            projectId: z.uuid(),
          }),
          body: z.object({
            name: z.string(),
            description: z.string(),
          }),

          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { slug, projectId } = request.params

        const { membership, organization } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermission(userId, membership.role)
        const project = await prisma.project.findUnique({
          where: {
            id: projectId,
            organizationId: organization.id,
          },
        })

        if (!project) {
          throw new BadRequestError('Project not found')
        }

        const authProject = projectSchema.parse(project)

        if (cannot('update', authProject)) {
          throw new UnauthorizedError(
            'You are not allowed to update this project'
          )
        }

        const { description, name } = request.body

        await prisma.project.update({
          where: {
            id: projectId,
          },
          data: {
            name,
            description,
          },
        })

        return reply.status(204).send()
      }
    )
}
