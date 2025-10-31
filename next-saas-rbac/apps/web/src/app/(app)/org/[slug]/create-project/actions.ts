'use server'

import { z } from 'zod'

import { createProject } from '@/http/create-project'
import { getCurrentOrg } from '@/auth/auth'

const projectSchema = z.object({
  name: z.string().min(4, { message: 'Please include at least 4 characters' }),
  description: z
    .string()
    .min(1, { message: 'Please include at least 1 character' }),
})

export async function createProjectAction(data: FormData) {
  const result = projectSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const flattened = z.flattenError(result.error)
    const errors = flattened.fieldErrors
    return { success: false, message: null, errors }
  }

  const { description, name } = result.data

  try {
    const org = await getCurrentOrg()
    if (!org) {
      return {
        success: false,
        message: 'No organization found for the current user',
        errors: null,
      }
    }

    await createProject({
      name,
      description,
      org,
    })
  } catch (err) {
    console.error(err)
    return {
      success: false,
      message: 'unexpected error, try again in few minutes',
      errors: null,
    }
  }
  return {
    success: true,
    message: 'Successfully saved the organization',
    errors: null,
  }
}
