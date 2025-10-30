'use server'

import { z } from 'zod'

import { signInWithPassword } from '@/http/sign-in-with-password'
import { HTTPError } from 'ky'

import { cookies } from 'next/headers'
import { signUp } from '@/http/sign-up'

const signUpSchema = z
  .object({
    email: z.email({ message: 'Please provide a valid email address' }),
    password: z
      .string({ message: 'Please provide your password' })
      .min(6, { message: 'Password should have at least 6 characters' }),
    name: z.string().refine((value) => value.split(' ').length > 1, {
      message: 'Please, enter your fullName',
    }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Password confirmation does not match',
    path: ['password_confirmation'],
  })

export async function signUpAction(data: FormData) {
  const result = signUpSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const flattened = z.flattenError(result.error)
    const errors = flattened.fieldErrors
    return { success: false, message: null, errors }
  }

  const { email, password, name } = result.data

  try {
    await signUp({
      email,
      password,
      name,
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
