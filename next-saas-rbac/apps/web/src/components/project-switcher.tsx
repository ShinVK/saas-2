'use client'

import { ChevronsUpDown, Loader2, PlusCircle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getProjects } from '@/http/get-projects'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from './ui/skeleton'

function ProjectSwitcher() {
  const { slug: orgSlug, project: projectSlug } = useParams<{
    slug: string
    project: string
  }>()

  // Decodificar o projectSlug para comparação
  const decodedProjectSlug = projectSlug
    ? decodeURIComponent(projectSlug)
    : null

  const { data, isLoading } = useQuery({
    queryKey: [orgSlug, 'projects'],
    queryFn: () => getProjects(orgSlug),
    enabled: !!orgSlug,
  })

  const currentProject =
    data && decodedProjectSlug
      ? data?.projects.find((project) => project.slug === decodedProjectSlug)
      : null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:ring-primary flex w-[168] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2">
        {isLoading ? (
          <>
            <Skeleton className="size-4 shrink-0 rounded-full" />
            <Skeleton className="h-4 w-full" />
          </>
        ) : currentProject ? (
          <>
            <Avatar className="size-4">
              {currentProject.avatarUrl && (
                <AvatarImage src={currentProject.avatarUrl} />
              )}
              <AvatarFallback />
            </Avatar>
            <span className="truncate text-left">{currentProject.name}</span>
          </>
        ) : (
          <span className="text-muted-foreground">Select project</span>
        )}

        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <ChevronsUpDown className="text-muted-foreground ml-auto size-4 shrink-0" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        alignOffset={-16}
        className="w-[200px]"
        sideOffset={12}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Projects</DropdownMenuLabel>
          {data &&
            data.projects.map((project) => {
              return (
                <DropdownMenuItem key={project.id} asChild>
                  <Link
                    href={`/org/${orgSlug}/project/${encodeURIComponent(project.slug)}`}
                  >
                    <Avatar className="mr-2 size-4">
                      {project.avatarUrl && (
                        <AvatarImage src={project.avatarUrl} />
                      )}
                      <AvatarFallback />
                    </Avatar>
                    <span className="line-clamp-1">{project.name}</span>
                  </Link>
                </DropdownMenuItem>
              )
            })}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/org/${orgSlug}/create-project`}>
            <PlusCircle className="mr-2 size-4" /> Created new project
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProjectSwitcher
