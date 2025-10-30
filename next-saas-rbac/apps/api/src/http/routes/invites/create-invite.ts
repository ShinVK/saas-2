import { prisma } from '@/lib/prisma'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { auth } from '@/http/middlewares/auth'
import { getUserPermission } from '@/lib/utils/get-user-permissions'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { roleSchema } from '@saas/auth'
import { BadRequestError } from '../_errors/bad-request-error'

export async function createInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/invites',
      {
        schema: {
          tags: ['invites'],
          summary: 'Create a new invite',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            email: z.email(),
            role: roleSchema,
          }),
          response: {
            201: z.object({
              inviteId: z.uuid(),
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

        if (cannot('create', 'Invite')) {
          throw new UnauthorizedError(
            'You are not allowed to created new invites'
          )
        }

        const { email, role } = request.body
        const [_, domain] = email

        if (
          organization.shouldAttachUsersByDomain &&
          organization.domain === domain
        ) {
          throw new BadRequestError(
            `Users with ${domain} domain will join your  organization automatically on login`
          )
        }

        const inviteWithSameEmail = await prisma.invite.findUnique({
          where: {
            email_organizationId: {
              email,
              organizationId: organization.id,
            },
          },
        })

        if (inviteWithSameEmail) {
          throw new BadRequestError(
            'Another invite with same e-mail already exists'
          )
        }

        const memberWithSameEmail = await prisma.member.findFirst({
          where: {
            organizationId: organization.id,
            user: {
              email,
            },
          },
        })

        if (memberWithSameEmail) {
          throw new BadRequestError(
            'A member with this e-mail already belongs to yoir organization'
          )
        }

        const newInvite = await prisma.invite.create({
          data: {
            organizationId: organization.id,
            email,
            role,
            authorId: userId,
          },
        })

        return reply.status(201).send({ inviteId: newInvite.id })
      }
    )
}
