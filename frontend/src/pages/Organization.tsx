import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { MoreVertical, ChevronRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Mail, PlusIcon, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useOrganization } from '@/lib/organiztion/organization-detail-hook';
import { useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getOrgMeta } from '@/lib/organiztion/organization-meta';
import { getRoleMeta } from '@/lib/organiztion/role-meta';
import type { OrganizationMemberType } from '@/lib/types/orgainzation-types';
import { toast } from 'sonner';

const supabaseApiKey = import.meta.env.VITE_SUPABASE_API_KEY;

export function OrgPage() {
  const { orgId } = useParams();

  const { data: organization, refetch } = useOrganization(orgId!);

  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'member' | 'admin' | 'all'>('member');
  const [search, setSearch] = useState<string>('');
  const [inviteLoading, setInviteLoading] = useState(false);
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

  const paginatedMembers = useMemo(() => {
    const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
    return filteredMembers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredMembers, activePage]);

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

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setInviteLoading(true);

      const { response, error } = await supabase.functions.invoke(
        'send-invite',
        {
          body: {
            organization_id: orgId,
            email,
            role: 'member',
          },
          headers: {
            apiKey: supabaseApiKey,
          },
        },
      );
      if (error) {
        const parsedResponse = await response?.json();
        toast.error(
          parsedResponse?.error ?? 'Some Error Ocurred Please Try Again',
        );
        return;
      }
      setEmail('');

      await refetch();
      toast.success('Member Invite Successful!');
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <div className="my-2 sm:my-5 mx-auto px-4 sm:px-0 flex flex-col justify-between gap-4 p-4 sm:p-6 bg-white border border-gray-100 rounded-xl shadow-sm max-w-5xl w-full">
      {/* Breadcrumbs Container with horizontal scroll safety */}
      <div className="px-4 sm:px-8">
        <div className="flex justify-start w-full overflow-x-auto pb-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="#">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="#">Components</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <main className="space-y-6">
          {/* Header Section: Stack on mobile, side-by-side on desktop */}
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

          {/* Invite Email Form: Inline on desktop, beautifully block-stacked on mobile */}
          <form onSubmit={handleInvite} className="w-full">
            <div className="flex flex-col sm:flex-row gap-2.5 w-full relative">
              <div className="relative flex-1 w-full">
                <Mail className="absolute top-1/2 left-3.5 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  placeholder="Enter email address to invite"
                  className="w-full h-11 p-3 pl-10 border-gray-200 border bg-white rounded-lg text-sm placeholder:text-gray-400 focus:outline-hidden focus:border-indigo-500 transition-colors"
                  value={email}
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                disabled={inviteLoading}
                variant={'default'}
                className="h-11 bg-indigo-500 flex space-x-1.5 w-full sm:w-auto shrink-0 justify-center items-center px-5 rounded-lg shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>{inviteLoading ? 'Sending...' : 'Send Invite'}</span>
              </Button>
            </div>
          </form>

          {/* Tabs and Filters Layout Structure */}
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

            {/* Search bar and selection drop down filters */}
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

          {/* Table Block Container with horizontal layout protection wrapper */}
          <div className="w-full bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            <div className="w-full overflow-x-auto">
              <Table className="w-full min-w-[600px] table-fixed">
                <TableHeader className="bg-gray-50/70 border-b border-gray-100">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-6 py-3.5 text-xs font-semibold text-gray-500 w-[40%]">
                      Member
                    </TableHead>
                    <TableHead className="text-center text-xs font-semibold text-gray-500 w-[15%]">
                      Role
                    </TableHead>
                    <TableHead className="text-center text-xs font-semibold text-gray-500 w-[15%]">
                      Status
                    </TableHead>
                    <TableHead className="text-center text-xs font-semibold text-gray-500 w-[15%]">
                      Joined
                    </TableHead>
                    <TableHead className="pr-6 text-right text-xs font-semibold text-gray-500 w-[15%]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedMembers.map((user: OrganizationMemberType) => {
                    const role_meta = getRoleMeta(user.role);
                    return (
                      <TableRow
                        key={user.id}
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/40 transition-colors"
                      >
                        <TableCell className="pl-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-linear-to-br from-indigo-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center uppercase tracking-wider shrink-0">
                              {user.email.at(0)}
                            </div>
                            <div className="flex flex-col min-w-0 truncate">
                              <span className="text-sm font-semibold text-gray-900 truncate">
                                {user.email.split('@').at(0)}
                              </span>
                              <span className="text-xs text-gray-400 font-medium truncate">
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="text-center">
                          <Badge
                            className={`px-1.5 py-0.5 rounded-md text-xs font-semibold shadow-none border-none tracking-wide capitalize ${role_meta.roleStyle}`}
                          >
                            {user.role}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide ${role_meta?.statusColor.split(' ').slice(1).join(' ') ?? ''}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${role_meta?.statusColor.split(' ')[0]}`}
                            />
                            {user.status}
                          </span>
                        </TableCell>

                        <TableCell className="text-center text-sm text-gray-500 font-medium">
                          {user.joined_at
                            ? new Date(user.joined_at).toLocaleDateString()
                            : '-'}
                        </TableCell>

                        <TableCell className="pr-6 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-400 hover:text-gray-700 hover:bg-gray-100/70 rounded-md"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-36">
                              <DropdownMenuItem className="text-xs font-medium text-gray-700">
                                Change Role
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-xs font-medium text-red-600 focus:text-red-600 focus:bg-red-50">
                                Remove Member
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Footer Pagination Segment */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-gray-50 bg-gray-50/30">
              <div className="text-[13px] text-gray-500 text-center sm:text-left">
                {filteredMembers.length > 0 ? (
                  <>
                    Showing {(activePage - 1) * 6 + 1} to{' '}
                    {Math.min((activePage - 1) * 6 + 6, filteredMembers.length)}{' '}
                    entries of {filteredMembers.length}
                  </>
                ) : (
                  'No entries available'
                )}
              </div>

              <div className="flex items-center gap-1.5 justify-center">
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNum = index + 1;
                  const isActive = pageNum === activePage;
                  return (
                    <Button
                      key={pageNum}
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium shadow-none transition-all ${
                        isActive
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-600 font-bold'
                          : 'border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 rounded-lg border-gray-200 text-gray-400 hover:text-gray-600"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={activePage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
