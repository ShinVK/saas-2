import { api } from './api-client'

interface IGetProjectsResponse {
  projects: {
    name: string
    id: string
    slug: string
    avatarUrl: string | null
    ownerId: string
    organizationId: string
    description: string | null
    createdAt: string
    owner: {
      name: string | null
      id: string
      avatarUrl: string | null
    }
  }[]
}

export async function getProjects(orgSlug: string) {
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const result = await api
    .get(`organizations/${orgSlug}/projects`)
    .json<IGetProjectsResponse>()
  console.log('🚀 VOA ~ getProjects ~ result:', result)

  return result
}
