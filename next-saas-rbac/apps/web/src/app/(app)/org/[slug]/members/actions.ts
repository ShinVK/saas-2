'use server'

import { getCurrentOrg } from '@/auth/auth'
import { removeMember } from '@/http/remove-member'
import { revokeInvite } from '@/http/revoke-invite'
import { updateMember } from '@/http/update-member'
import { Role, roleSchema } from '@saas/auth'
import { revalidateTag } from 'next/cache'

import { z } from 'zod'

import { createInvite } from '@/http/create-invite'

const inviteSchema = z.object({
  email: z.email({ message: 'Must be a valid e-mail' }),
  role: roleSchema,
})

export async function createInviteAction(data: FormData) {
  const result = inviteSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const flattened = z.flattenError(result.error)
    const errors = flattened.fieldErrors
    return { success: false, message: null, errors }
  }

  const { email, role } = result.data

  try {
    const org = await getCurrentOrg()
    if (!org) {
      return {
        success: false,
        message: 'No organization found for the current user',
        errors: null,
      }
    }

    await createInvite({
      email,
      role,
      org,
    })
    revalidateTag(`${org}/invites`, 'max')
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
    message: 'Successfully created invite',
    errors: null,
  }
}

export async function removeMemberAction(memberId: string) {
  const currentOrg = await getCurrentOrg()

  await removeMember({
    org: currentOrg!,
    memberId,
  })

  revalidateTag(`${currentOrg}/members`, 'max')
}

export async function updateMemberAction(memberId: string, role: Role) {
  const currentOrg = await getCurrentOrg()

  await updateMember({
    org: currentOrg!,
    memberId,
    role,
  })

  revalidateTag(`${currentOrg}/members`, 'max')
}

export async function revokeInviteAction(inviteId: string) {
  const currentOrg = await getCurrentOrg()

  await revokeInvite(currentOrg!, inviteId)

  revalidateTag(`${currentOrg}/invites`, 'max')
}
