import { api } from './api-client'

export async function revokeInvite(orgSlug: string, inviteId: string) {
  const result = await api.delete(
    `organizations/${orgSlug}/invites/${inviteId}`
  )

  return result
}
