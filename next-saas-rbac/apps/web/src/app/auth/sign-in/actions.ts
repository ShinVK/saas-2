'use server'

import { z } from 'zod'

import { signInWithPassword } from '@/http/sign-in-with-password'
import { HTTPError } from 'ky'

import { cookies } from 'next/headers'

const signInSchema = z.object({
  email: z.email({ message: 'Please provide a valid email address' }),
  password: z
    .string({ message: 'Please provide your password' })
    .min(1, { message: 'Password is short' }),
})

export async function signInWithEmailAndPassword(data: FormData) {
  const result = signInSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const flattened = z.flattenError(result.error)
    const errors = flattened.fieldErrors

    return { success: false, message: null, errors }
  }

  const { email, password } = result.data

  try {
    const { token } = await signInWithPassword({
      email,
      password,
    })
    const cookieStore = await cookies()
    cookieStore.set('token', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()

      return { success: false, message, errors: null }
    }
    console.error(err)
    return {
      success: false,
      message: 'unexpected error, try again in few minutes',
      errors: null,
    }
  }

  return { success: true, message: null, errors: null }
}
