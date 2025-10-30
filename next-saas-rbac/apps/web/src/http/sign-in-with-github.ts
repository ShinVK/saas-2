import { api } from './api-client'

interface ISignInWithGitHubRequest {
  code: string
}

interface ISignInWithGitHubResponse {
  token: string
}

export async function signInWithGithub({ code }: ISignInWithGitHubRequest) {
  const result = await api
    .post('sessions/github', {
      json: {
        code,
      },
    })
    .json<ISignInWithGitHubResponse>()

  return result
}
