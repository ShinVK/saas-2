import { Role } from '@saas/auth'
import { api } from './api-client'

interface IGetInvitesResponse {
  invites: {
    id: string
    email: string
    role: Role
    createdAt: string
    author: {
      id: string
      name: string | null
    } | null
  }[]
}

export async function getInvites(orgSlug: string) {
  const result = await api
    .get(`organizations/${orgSlug}/invites`, {
      next: {
        tags: [`${orgSlug}/invites`],
      },
    })
    .json<IGetInvitesResponse>()

  return result
}
