import { api } from './api-client'

interface IRemoveMemberRequest {
  org: string
  memberId: string
}

export async function removeMember({ org, memberId }: IRemoveMemberRequest) {
  const result = await api.delete(`organizations/${org}/members/${memberId}`)

  return result
}
