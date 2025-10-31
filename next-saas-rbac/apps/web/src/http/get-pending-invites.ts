import { Role } from '@saas/auth'
import { api } from './api-client'

interface IGetPendingInvitesResponse {
  invites: {
    id: string
    email: string
    role: Role
    createdAt: string
    author: {
      id: string
      name: string | null
      avatarUrl: string | null
    } | null
    organization: {
      name: string
    }
  }[]
}

export async function getPendingInvites() {
  const result = await api
    .get(`pending-invites`)
    .json<IGetPendingInvitesResponse>()

  return result
}
