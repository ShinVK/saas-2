import { Role } from '@saas/auth'
import { api } from './api-client'

interface ICreateInviteRequest {
  email: string
  org: string
  role: Role
}

type ICreateOrganizationResponse = void

export async function createInvite({
  email,
  org,
  role,
}: ICreateInviteRequest): Promise<ICreateOrganizationResponse> {
  await api.post(`organizations/${org}/invites`, {
    json: {
      email,
      role,
    },
  })
}
