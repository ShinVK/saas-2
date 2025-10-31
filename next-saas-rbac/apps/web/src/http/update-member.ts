import { Role } from '@saas/auth'
import { api } from './api-client'

interface IUpdateMemberRequest {
  org: string
  memberId: string
  role: Role
}

export async function updateMember({
  org,
  memberId,
  role,
}: IUpdateMemberRequest) {
  const result = await api.put(`organizations/${org}/members/${memberId}`, {
    json: {
      role,
    },
  })

  return result
}
