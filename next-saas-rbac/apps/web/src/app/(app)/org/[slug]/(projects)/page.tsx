import { ability, getCurrentOrg } from '@/auth/auth'
import ProjectList from './project-list'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function Projects() {
  const permissions = await ability()
  const org = await getCurrentOrg()

  // if (permissions?.cannot('get', 'Project')) {
  //   redirect('/')
  // }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        {permissions?.can('create', 'Project') && (
          <Button size="sm" asChild>
            <Link href={`/org/${org}/create-project`}>
              <Plus className="mr-2 size-4" />
              Create Project
            </Link>
          </Button>
        )}
      </div>

      {permissions?.can('get', 'Project') ? (
        <ProjectList />
      ) : (
        <p className="text-muted-foreground text-sm">
          You are not allowed to see organization projects
        </p>
      )}
    </div>
  )
}
