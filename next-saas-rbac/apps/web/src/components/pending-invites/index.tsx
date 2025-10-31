'use client'

import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Check, UserPlus2, X } from 'lucide-react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getPendingInvites } from '@/http/get-pending-invites'
import { acceptInviteAction, rejectInviteAction } from './actions'
dayjs.extend(relativeTime)

export default function PendingInvites() {
  const [isOpen, setIsOpen] = React.useState(false)
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['pending-invites'],
    queryFn: getPendingInvites,
    enabled: isOpen,
  })

  async function handleAcceptInvite(inviteId: string) {
    await acceptInviteAction(inviteId)
    queryClient.invalidateQueries({ queryKey: ['pending-invites'] })
  }

  async function handleRejectInvite(inviteId: string) {
    await rejectInviteAction(inviteId)
    queryClient.invalidateQueries({ queryKey: ['pending-invites'] })
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost">
          <UserPlus2 className="size-4" />
          <span className="sr-only">Pending invites</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-88 space-y-2">
        <span className="text-sm font-medium">
          Pending invites ({data?.invites.length})
        </span>

        {data?.invites.length === 0 && (
          <p className="to-muted-foreground text-sm">No invites founded</p>
        )}

        {data?.invites.map((invite) => {
          return (
            <div className="space-y-2" key={invite.id}>
              <p className="text-muted-foreground leading-relaxed">
                <span className="text-foreground font-medium">
                  {invite.author?.name ?? 'someone'}{' '}
                </span>{' '}
                invited you to join{' '}
                <span className="text-foreground font-medium">
                  {invite.organization.name}{' '}
                </span>{' '}
                <span>{dayjs(invite.createdAt).fromNow()}</span>
              </p>
              <div className="flex gap-1">
                <Button
                  size="xs"
                  variant="outline"
                  onClick={async () => await handleAcceptInvite(invite.id)}
                >
                  <Check className="mr-1.5 size-3" /> Accept
                </Button>
                <Button
                  size="xs"
                  variant="ghost"
                  className="text-muted-foreground"
                  onClick={async () => await handleRejectInvite(invite.id)}
                >
                  <X className="mr-1.5 size-3" />
                  Reject
                </Button>
              </div>
            </div>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}
