import { ability, getCurrentOrg } from '@/auth/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { getInvites } from '@/http/get-invites'
import { RevokeInviteButton } from './revoke-invite-button'
import InviteForm from './invite-form'

export async function Invites() {
  const currentOrg = await getCurrentOrg()
  const { invites } = await getInvites(currentOrg!)
  const permissions = await ability()

  return (
    <div className="space-y-4">
      {permissions?.can('create', 'Invite') && (
        <Card>
          <CardHeader>
            <CardTitle>Invite Member</CardTitle>
            <CardContent className="p-0">
              <InviteForm />
            </CardContent>
          </CardHeader>
        </Card>
      )}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Members</h2>
        <div className="rounded border">
          <Table>
            <TableBody>
              {invites.map((invite) => {
                return (
                  <TableRow key={invite.id}>
                    <TableCell className="py-2.5">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">
                          {invite.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5 font-medium">
                      {invite.role}
                    </TableCell>
                    <TableCell className="py-2.5">
                      <div className="flex justify-end">
                        {permissions?.can('delete', 'Invite') && (
                          <RevokeInviteButton inviteId={invite.id} />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {invites.length === 0 && (
                <TableRow>
                  <TableCell className="text-muted-foreground text-center">
                    {' '}
                    No invites Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
