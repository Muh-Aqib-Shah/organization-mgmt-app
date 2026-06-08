import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Search } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useOrganization } from '@/lib/organiztion/organization-detail-hook';
import { useMemo, useState } from 'react';
import { getOrgMeta } from '@/lib/organiztion/organization-meta';
import type { OrganizationMemberType } from '@/lib/types/orgainzation-types';
import { MemberTable } from '@/components/organization/member-table';
import { SendInviteForm } from '@/components/organization/invite-form';

export function OrgPage() {
  const { orgId } = useParams();

  const { data: organization, refetch } = useOrganization(orgId!);

  const [role, setRole] = useState<'member' | 'admin' | 'all'>('all');
  const [search, setSearch] = useState<string>('');
  const [currentTab, setCurrentTab] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 6;

  const members = organization?.organization_members ?? [];
  const organization_meta = getOrgMeta(organization?.type ?? 'business');

  const counts = useMemo(() => {
    return {
      all: members.length,
      accepted: members.filter(
        (m: OrganizationMemberType) => m.status?.toLowerCase() === 'active',
      ).length,
      invited: members.filter(
        (m: OrganizationMemberType) => m.status?.toLowerCase() === 'invited',
      ).length,
    };
  }, [members]);

  const filteredMembers = useMemo(() => {
    return members.filter((member: OrganizationMemberType) => {
      const matchesSearch = member.email
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchesRole =
        role === 'all' || member.role?.toLowerCase() === role.toLowerCase();

      const matchesTab =
        currentTab === 'all' ||
        member.status?.toLowerCase() === currentTab.toLowerCase();

      return matchesSearch && matchesRole && matchesTab;
    });
  }, [members, search, role, currentTab]);

  const totalItems = filteredMembers.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;

  const activePage = currentPage > totalPages ? totalPages : currentPage;

  const handleTabChange = (val: string) => {
    setCurrentTab(val);
    setCurrentPage(1);
  };

  const handleRoleChange = (val: 'all' | 'admin' | 'member') => {
    setRole(val);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="my-2 sm:my-5 mx-auto px-4 sm:px-0 flex flex-col justify-between gap-4 p-4 sm:p-6 bg-white border border-gray-100 rounded-xl shadow-sm max-w-5xl w-full">
      <div className="px-4 sm:px-8">
        <div className="flex justify-start w-full overflow-x-auto pb-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="#">Orgainzation</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <main className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex space-x-4 items-start">
              <p className="text-3xl select-none pt-0.5">
                {organization_meta.icon}
              </p>
              <div className="space-y-0.5">
                <h2 className="text-xl font-bold text-gray-900 text-start">
                  {organization?.name}
                </h2>
                <p className="text-xs text-gray-500 text-start leading-normal">
                  Manage your organization members and their access
                </p>
              </div>
            </div>

            <div className="w-full sm:w-auto shrink-0">
              <Button
                variant={'default'}
                className="bg-purple-500 w-full sm:w-auto justify-center"
              >
                <PlusIcon className="w-4 h-4 mr-1.5" /> Invite
              </Button>
            </div>
          </div>

          <SendInviteForm
            orgId={orgId}
            refetch={refetch}
            key={'send-invite-form'}
          />

          <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-3 border-b border-gray-100">
            <Tabs
              defaultValue="all"
              className="w-full lg:w-auto overflow-x-auto scrollbar-none"
              value={currentTab}
              onValueChange={handleTabChange}
            >
              <TabsList className="bg-transparent gap-2 h-auto p-0 border-b border-transparent rounded-none flex flex-row whitespace-nowrap">
                <TabsTrigger
                  value="all"
                  className="px-3 py-2 text-sm font-semibold text-gray-500 rounded-none border-b-2 border-transparent data-[state=active]:border-b-indigo-600 data-[state=active]:text-indigo-600"
                >
                  All Members
                  <Badge
                    className="ml-2 bg-indigo-50 text-indigo-600 font-semibold text-xs border-none hover:bg-indigo-50 rounded-full px-2 py-0.5"
                    variant="outline"
                  >
                    {counts.all}
                  </Badge>
                </TabsTrigger>

                <TabsTrigger
                  value="active"
                  className="px-3 py-2 text-sm font-medium text-gray-500 rounded-none border-b-2 border-transparent data-[state=active]:border-b-indigo-600 data-[state=active]:text-indigo-600 bg-transparent"
                >
                  Accepted
                  <Badge
                    className="ml-2 bg-gray-100 text-gray-600 font-semibold text-xs border-none hover:bg-gray-100 rounded-full px-2 py-0.5"
                    variant="outline"
                  >
                    {counts.accepted}
                  </Badge>
                </TabsTrigger>

                <TabsTrigger
                  value="invited"
                  className="px-3 py-2 text-sm font-medium text-gray-500 rounded-none border-b-2 border-transparent data-[state=active]:border-b-indigo-600 data-[state=active]:text-indigo-600 "
                >
                  Invited
                  <Badge
                    className="ml-2 bg-gray-100 text-gray-600 font-semibold text-xs border-none hover:bg-gray-100 rounded-full px-2 py-0.5"
                    variant="outline"
                  >
                    {counts.invited}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <Input
                  placeholder="Search members..."
                  className="pl-9 h-10 border-gray-200 focus-visible:ring-indigo-500 rounded-lg shadow-none text-sm text-gray-600 placeholder:text-gray-400"
                  value={search}
                  onChange={(e) => handleSearchChange(e)}
                />
              </div>

              <Select
                defaultValue="all"
                value={role}
                onValueChange={(value) =>
                  handleRoleChange(value as 'member' | 'admin')
                }
              >
                <SelectTrigger className="w-full sm:w-40 h-10 border-gray-200 focus:ring-indigo-500 rounded-lg text-sm text-gray-700 font-medium shadow-none">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <MemberTable
            activePage={activePage}
            filteredMembers={filteredMembers}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            key={'member-table'}
          />
        </main>
      </div>
    </div>
  );
}
