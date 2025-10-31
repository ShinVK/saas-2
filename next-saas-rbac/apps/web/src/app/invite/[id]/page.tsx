import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInvite } from '@/http/get-invite'
import React from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Separator } from '@/components/ui/separator'
import { auth, isAuthenticate } from '@/auth/auth'
import { Button } from '@/components/ui/button'
import { CheckCircle, LogIn, LogOut } from 'lucide-react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { acceptInvite } from '@/http/accept-invite'
import Link from 'next/link'

dayjs.extend(relativeTime)

interface InvitePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { id: inviteId } = await params

  let currentUserEmail = null

  const { invite } = await getInvite(inviteId)
  const isUserAuthenticate = await isAuthenticate()
  if (isUserAuthenticate) {
    const { user } = await auth()
    currentUserEmail = user.email
  }
  const userIsAuthenticatedWithSameEmailFromIvite =
    currentUserEmail === invite.email

  async function signInFromInvite() {
    'use server'
    const cookiesStore = await cookies()
    cookiesStore.set('inviteId', inviteId)

    redirect(`/auth/sign-in?email=${invite.email}`)
  }

  async function acceptInviteAction() {
    'use server'
    await acceptInvite(inviteId)

    redirect('/')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col justify-center space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="size-16">
            {invite.author?.avatarUrl && (
              <AvatarImage src={invite.author?.avatarUrl} />
            )}
            <AvatarFallback />
          </Avatar>
          <p className="text-muted-foreground text-center leading-relaxed text-balance">
            <span className="text-foreground font-medium">
              {invite.author?.name ?? 'someone'}{' '}
            </span>
            invited you to join{' '}
            <span className="text-foreground font-medium">
              {invite.organization.name}{' '}
            </span>
            <span className="text-xs">{dayjs(invite.createdAt).fromNow()}</span>
          </p>
        </div>
        <Separator />

        {!isUserAuthenticate && (
          <form action={signInFromInvite}>
            <Button type="submit" className="w-full" variant="secondary">
              <LogIn className="mr-2 size-4" />
              Sign in to accept the invite
            </Button>
          </form>
        )}
        {userIsAuthenticatedWithSameEmailFromIvite && (
          <form action={acceptInviteAction}>
            <Button type="submit" className="w-full" variant="secondary">
              <CheckCircle className="mr-2 size-4" />
              Join {invite.organization.name}
            </Button>
          </form>
        )}

        {isUserAuthenticate && !userIsAuthenticatedWithSameEmailFromIvite && (
          <div className="space-y-4">
            <p className="text-center text-sm leading-relaxed text-balance">
              This invite was sent to{' '}
              <span className="text-foreground font-medium">
                {invite.email}
              </span>{' '}
              but you are currently authenticated as{' '}
              <span className="text-foreground font-medium">
                {currentUserEmail}
              </span>
            </p>
            <div className="space-y-2">
              <Button className="w-full" variant="secondary" asChild>
                <a href="/api/auth/sign-out">
                  <LogOut className="mr-2 size-4" />
                  Sign out from {currentUserEmail}
                </a>
              </Button>

              <Button className="w-full" variant="outline" asChild>
                <Link href="/">Back to dashboard</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
