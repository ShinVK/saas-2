import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { ChevronsUpDown, PlusCircle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import Link from 'next/link'
import { getOrganizations } from '@/http/get-organizations'
import { getCurrentOrg } from '@/auth/auth'

async function OrganizationSwitcher() {
  const currentOrg = await getCurrentOrg()

  const { organizations } = await getOrganizations()
  const currentOrganization = organizations.find(
    (org) => org.slug === currentOrg
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:ring-primary flex w-[168] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2">
        {currentOrganization ? (
          <>
            <Avatar className="size-4">
              {currentOrganization.avatarUrl && (
                <AvatarImage src={currentOrganization.avatarUrl} />
              )}
              <AvatarFallback />
            </Avatar>
            <span className="truncate text-left">
              {currentOrganization.name}
            </span>
          </>
        ) : (
          <span className="text-muted-foreground">Select organization</span>
        )}

        <ChevronsUpDown className="text-muted-foreground ml-auto size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        alignOffset={-16}
        className="w-[200px]"
        sideOffset={12}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Organizations</DropdownMenuLabel>
          {organizations.map((organization) => {
            return (
              <DropdownMenuItem key={organization.id} asChild>
                <Link href={`/org/${organization.slug}`}>
                  <Avatar className="mr-2 size-4">
                    {organization.avatarUrl && (
                      <AvatarImage src={organization.avatarUrl} />
                    )}
                    <AvatarFallback />
                  </Avatar>
                  <span className="line-clamp-1">{organization.name}</span>
                </Link>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/create-organization">
            <PlusCircle className="mr-2 size-4" /> Created new
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default OrganizationSwitcher
