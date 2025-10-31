import { api } from './api-client'

interface IUpdateOrganizationRequest {
  org: string
  name: string
  domain: string | null
  shouldAttachUsersByDomain: boolean
}

type IUpdateOrganizationResponse = void

export async function updateOrganization({
  org,
  name,
  domain,
  shouldAttachUsersByDomain,
}: IUpdateOrganizationRequest): Promise<IUpdateOrganizationResponse> {
  await api.put(`organizations/${org}`, {
    json: {
      name,
      domain,
      shouldAttachUsersByDomain,
    },
  })
}
