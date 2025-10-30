import { isAuthenticate } from '@/auth/auth'
import { Header } from '@/components/header'
import { redirect } from 'next/navigation'

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  if (!(await isAuthenticate())) {
    redirect('/auth/sign-in')
  }

  return <>{children}</>
}
