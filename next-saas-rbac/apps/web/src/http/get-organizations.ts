import { api } from './api-client'

interface IGetOrganizationsResponse {
  organizations: {
    name: string
    id: string
    slug: string
    avatarUrl: string | null
  }[]
}

export async function getOrganizations() {
  const result = await api
    .get('organizations')
    .json<IGetOrganizationsResponse>()

  return result
}
