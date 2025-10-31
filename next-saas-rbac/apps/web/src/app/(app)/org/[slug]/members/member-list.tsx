import { ability, getCurrentOrg } from '@/auth/auth'
import { AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { getMembers } from '@/http/get-members'
import { getMembership } from '@/http/get-membership'
import { getOrganization } from '@/http/get-organization'
import { Avatar } from '@radix-ui/react-avatar'
import { organizationSchema } from '@saas/auth'
import { ArrowLeftRight, Crown, UserMinus } from 'lucide-react'
import Image from 'next/image'
import { removeMemberAction } from './actions'
import UpdateMemberRoleSelection from './update-member-role-select'

export async function MemberList() {
  const currentOrg = await getCurrentOrg()

  const permissions = await ability()

  const [{ membership }, { members }, { organization }] = await Promise.all([
    await getMembership(currentOrg!),
    await getMembers(currentOrg!),
    await getOrganization(currentOrg!),
  ])

  const authOrganization = organizationSchema.parse(organization)

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Members</h2>
      <div className="rounded border">
        <Table>
          <TableBody>
            {members.map((member) => {
              return (
                <TableRow key={member.id}>
                  <TableCell className="py-2.5" style={{ width: 48 }}>
                    <Avatar>
                      <AvatarFallback />
                      {member.avatarUrl && (
                        <Image
                          src={member.avatarUrl}
                          alt="Profile image"
                          width={32}
                          height={32}
                          className="aspect-square"
                        />
                      )}
                    </Avatar>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <div className="flex flex-col">
                      <span className="inline-flex items-center gap-2 font-medium">
                        {member.name}
                        {member.userId === membership.userId && '  (me)'}
                        {member.userId === organization.ownerId && (
                          <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
                            <Crown className="size-3" />
                            Owner
                          </span>
                        )}
                      </span>
                      <span className="font-muted-foreground text-xs">
                        {member.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <div className="flex items-center justify-end gap-2">
                      {permissions?.can(
                        'transfer_ownership',
                        authOrganization
                      ) && (
                        <Button size="sm" variant="ghost">
                          <ArrowLeftRight className="mr-2 size-4" />
                          Transfer ownership
                        </Button>
                      )}

                      <UpdateMemberRoleSelection
                        memberId={member.id}
                        value={member.role}
                        disabled={
                          member.id === membership.userId ||
                          member.userId === organization.ownerId ||
                          permissions?.cannot('update', 'User')
                        }
                      />

                      {permissions?.can('delete', 'User') && (
                        <form action={removeMemberAction.bind(null, member.id)}>
                          <Button
                            size="sm"
                            variant="destructive"
                            type="submit"
                            disabled={
                              member.id === membership.userId ||
                              member.userId === organization.ownerId
                            }
                          >
                            <UserMinus className="mr-2 size-4" />
                            Remove
                          </Button>
                        </form>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
