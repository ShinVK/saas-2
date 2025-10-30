import { Header } from '@/components/header'
import OrganizationForm from './organization-form'

function Creatorganization() {
  return (
    <div className="space-y-4 py-4">
      <Header />
      <main className="mx-auto w-full max-w-[1200px] space-y-4">
        <h1 className="text-2xl">Create organization</h1>

        <OrganizationForm />
      </main>
    </div>
  )
}

export default Creatorganization
