import { api } from './api-client'

interface ICreateProjectRequest {
  name: string
  org: string
  description: string
}

type ICreateOrganizationResponse = void

export async function createProject({
  name,
  org,
  description,
}: ICreateProjectRequest): Promise<ICreateOrganizationResponse> {
  await api.post(`organizations/${org}/projects`, {
    json: {
      name,
      description,
    },
  })
}
