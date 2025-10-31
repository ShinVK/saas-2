import { api } from './api-client'

type ICreateOrganizationResponse = void

export async function acceptInvite(
  inviteId: string
): Promise<ICreateOrganizationResponse> {
  await api.post(`invites/${inviteId}/accept`)
}
