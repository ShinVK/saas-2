'use server'

import { z } from 'zod'

import { HTTPError } from 'ky'
import { createOrganization } from '@/http/create-organization'
import { getCurrentOrg } from '@/auth/auth'
import { updateOrganization } from '@/http/update-organization'
import { revalidateTag } from 'next/cache'

export type OrganizationSchema = z.infer<typeof organizationSchema>

const organizationSchema = z
  .object({
    name: z
      .string()
      .min(4, { message: 'Please include at least 4 characters' }),
    domain: z
      .string()
      .nullable()
      .refine(
        (value) => {
          if (value) {
            const domainRegex =
              /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

            return domainRegex.test(value)
          }
          return true
        },
        { message: 'Please enter a valid domain' }
      ),
    shouldAttachUsersByDomain: z
      .union([z.literal('on'), z.literal('of'), z.boolean()])
      .transform((value) => value === true || value === 'on')
      .default(false),
  })
  .refine(
    (data) => {
      if (data.shouldAttachUsersByDomain === true && !data.domain) {
        return false
      }
      return true
    },
    {
      message: 'Domain is required when auto-join is enabled',
      path: ['domain'],
    }
  )

export async function createOrganizationAction(data: FormData) {
  const result = organizationSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const flattened = z.flattenError(result.error)
    const errors = flattened.fieldErrors
    return { success: false, message: null, errors }
  }

  const { shouldAttachUsersByDomain, domain, name } = result.data

  try {
    await createOrganization({
      shouldAttachUsersByDomain,
      domain,
      name,
    })
    revalidateTag('organizations', 'max')
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

  return {
    success: true,
    message: 'Successfully saved the organization',
    errors: null,
  }
}

export async function updateOrganizationAction(data: FormData) {
  const currentOrg = await getCurrentOrg()

  const result = organizationSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const flattened = z.flattenError(result.error)
    const errors = flattened.fieldErrors
    return { success: false, message: null, errors }
  }

  const { shouldAttachUsersByDomain, domain, name } = result.data

  try {
    await updateOrganization({
      org: currentOrg!,
      shouldAttachUsersByDomain,
      domain,
      name,
    })
    revalidateTag('organizations', 'max')
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

  return {
    success: true,
    message: 'Successfully saved the organization',
    errors: null,
  }
}
