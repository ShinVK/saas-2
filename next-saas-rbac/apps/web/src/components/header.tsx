import Image from 'next/image'
import genericLogo from '@/assets/github-icon.svg'
import ProfileButton from './profile-button'
import OrganizationSwitcher from './organization-switcher'
import { Slash } from 'lucide-react'
import { ability } from '@/auth/auth'
import { Separator } from './ui/separator'
import { ThemeSwitcher } from './theme/theme-switcher'
import ProjectSwitcher from './project-switcher'

export async function Header() {
  const permissions = await ability()

  return (
    <div className="mx-auto flex max-w-[1200px] items-center justify-between border-b pb-2">
      <div className="flex items-center gap-3">
        <Image
          src={genericLogo}
          alt="generic logo"
          className="size-6 dark:invert"
        />

        <Slash className="text-border size-3 -rotate-24" />

        <OrganizationSwitcher />
        {permissions?.can('get', 'Project') && (
          <>
            <Slash className="text-border size-3 -rotate-24" />

            <ProjectSwitcher />
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <Separator orientation="vertical" className="h-5" />
        <ProfileButton />
      </div>
    </div>
  )
}
