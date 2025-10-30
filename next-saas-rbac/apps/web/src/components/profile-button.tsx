import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { ChevronDown, LogOut } from 'lucide-react'
import { auth } from '@/auth/auth'

function getInitials(name: string): string {
  if (!name || name.trim().length === 0) {
    return ''
  }

  const words = name.trim().split(/\s+/)

  if (words.length === 1) {
    // Single word: take first two characters
    return words[0].substring(0, 2).toUpperCase()
  }

  // Multiple words: take first letter of first and last word
  const firstInitial = words[0].charAt(0)
  const lastInitial = words[words.length - 1].charAt(0)

  return (firstInitial + lastInitial).toUpperCase()
}

export default async function ProfileButton() {
  const { user } = await auth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 outline-none">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium">{user.name}</span>
          <span className="text-muted-foreground text-xs"> {user.email}</span>
        </div>

        <Avatar className="size-8">
          {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
          {user.name && (
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          )}
        </Avatar>
        <ChevronDown className="text-muted-foreground size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <a href="/api/auth/sign-out">
            <LogOut className="mr-2 size-4" /> Sign out
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
