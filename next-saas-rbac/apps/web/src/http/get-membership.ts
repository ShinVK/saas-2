import { Role } from '@saas/auth'
import { api } from './api-client'

interface IGetMembershipResponse {
  membership: {
    id: string
    role: Role
    organizationId: string
    userId: string
  }
}

export async function getMembership(org: string) {
  const result = await api
    .get(`organizations/${org}/membership`)
    .json<IGetMembershipResponse>()

  return result
}
