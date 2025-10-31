import { ability, getCurrentOrg } from '@/auth/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import React from 'react'
import OrganizationForm from '../../organization-form'
import ShutDownOrganizationButton from './shutdown-organization-button'
import { getOrganization } from '@/http/get-organization'
import Billing from './billing'

async function Settings() {
  const permissions = await ability()

  const canUpdateOrganization = permissions?.can('update', 'Organization')
  const canGetBilling = permissions?.can('get', 'Billing')
  const canShutDowndOrganization = permissions?.can('delete', 'Organization')

  const currentOrg = await getCurrentOrg()
  const { organization } = await getOrganization(currentOrg!)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="space-y-4">
        {canUpdateOrganization && (
          <Card>
            <CardHeader>
              <CardTitle>Update your organization details</CardTitle>
              <CardDescription>
                Update your organization details
              </CardDescription>
              <CardContent>
                <OrganizationForm
                  isUpdating
                  initialData={{
                    name: organization.name,
                    domain: organization.domain,
                    shouldAttachUsersByDomain:
                      organization.shouldAttachUsersByDomain,
                  }}
                />
              </CardContent>
            </CardHeader>
          </Card>
        )}
      </div>
      {canGetBilling && <Billing />}

      {canShutDowndOrganization && (
        <Card>
          <CardHeader>
            <CardTitle>Shutdown Organization</CardTitle>
            <CardDescription>
              This will delete all organization data including all projects. You
              cannot undo this action.
            </CardDescription>
            <CardContent>
              <ShutDownOrganizationButton />
            </CardContent>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}

export default Settings
