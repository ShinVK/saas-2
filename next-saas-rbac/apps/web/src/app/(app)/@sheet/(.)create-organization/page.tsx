import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { InterceptedSheetContent } from '@/components/intercepted-sheet-content'
import OrganizationForm from '../../org/organization-form'

function CreateOrganization() {
  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent>
        <SheetHeader>
          <SheetTitle>Create organization</SheetTitle>
        </SheetHeader>
        <div className="px-4 py-4">
          <OrganizationForm />
        </div>
      </InterceptedSheetContent>
    </Sheet>
  )
}

export default CreateOrganization
