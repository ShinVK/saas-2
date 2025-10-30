import { auth } from '@/auth/auth'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'

export default async function Projects() {
  return (
    <div className="space-y-4 py-4">
      <Header />
      <main className="mx-auto w-full max-w-[1200px]">
        <h1>projects</h1>
      </main>
    </div>
  )
}
