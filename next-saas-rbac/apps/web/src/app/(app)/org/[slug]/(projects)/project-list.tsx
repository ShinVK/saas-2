import { getCurrentOrg } from '@/auth/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getProjects } from '@/http/get-projects'
import { ArrowRight } from 'lucide-react'
import React from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'

dayjs.extend(relativeTime)

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

export default async function ProjectList() {
  const org = await getCurrentOrg()

  const { projects } = await getProjects(org!)

  return (
    <div className="grid grid-cols-3 gap-4">
      {projects.map((project) => {
        return (
          <Card key={project.id} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-xl font-medium">
                {project.name}
              </CardTitle>
              <CardDescription className="line-clamp-2 leading-relaxed">
                {project.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex items-center gap-1.5">
              <Avatar className="size-4">
                {project.owner.avatarUrl && (
                  <AvatarImage src={project.owner.avatarUrl} />
                )}
                {project.owner.name ? (
                  <AvatarFallback>
                    {getInitials(project.owner.name)}
                  </AvatarFallback>
                ) : (
                  <AvatarFallback />
                )}
              </Avatar>
              <span className="text-muted-foreground text-xs">
                <span className="text-foreground font-medium">
                  {project.owner.name}
                </span>{' '}
                {dayjs(project.createdAt).fromNow()}
              </span>
              <Button className="ml-auto" size="xs" variant="outline" asChild>
                <Link href={`/org/${org}/project/${project.slug}`}>
                  View <ArrowRight className="ml-2 size-3" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
