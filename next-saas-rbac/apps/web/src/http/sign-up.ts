import { api } from './api-client'

interface ISignUpRequest {
  email: string
  name: string
  password: string
}

type ISignUpResponse = void

export async function signUp({
  email,
  password,
  name,
}: ISignUpRequest): Promise<ISignUpResponse> {
  await api.post('users', {
    json: {
      name,
      email,
      password,
    },
  })
}
