import { getMembership } from '@/http/get-membership'
import { getProfile } from '@/http/get-profile'
import { defineAbilityFor } from '@saas/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function isAuthenticate() {
  const cookiesStore = await cookies()

  return !!cookiesStore.get('token')?.value
}

export async function auth() {
  const cookiesStore = await cookies()

  const token = cookiesStore.get('token')?.value
  if (!token) {
    redirect('/auth/sign-in')
  }

  try {
    const { user } = await getProfile()
    return { user }
  } catch (err) {
    // cookiesStore.delete('token')
  }
  redirect('/api/auth/sign-out')
}

export async function getCurrentOrg() {
  const currentOrg = (await cookies()).get('org')?.value ?? null
  return currentOrg
}

export async function getCurrentMembership() {
  const organization = await getCurrentOrg()

  if (!organization) {
    return null
  }

  const { membership } = await getMembership(organization)

  return membership
}

export async function ability() {
  const membership = await getCurrentMembership()

  if (!membership) {
    return null
  }

  const ability = defineAbilityFor({
    id: membership.userId,
    role: membership.role,
  })

  return ability
}
