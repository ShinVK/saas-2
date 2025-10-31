import { api } from './api-client'

interface IShutdownOrganizationRequest {
  org: string
}

export async function shutdownOrganization({
  org,
}: IShutdownOrganizationRequest) {
  const result = await api.delete(`organizations/${org}`)

  return result
}
