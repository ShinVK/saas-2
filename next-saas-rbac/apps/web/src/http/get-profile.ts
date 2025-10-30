import { api } from './api-client'

interface IGetProfileResponse {
  user: {
    id: string
    name: string | null
    email: string
    avatarUrl: string | null
  }
}

export async function getProfile() {
  const result = await api.get('profile').json<IGetProfileResponse>()

  return result
}
