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
import type { OrganizationMember } from '@/lib/types/orgainzation-types';

const supabaseApiKey =  import.meta.env.VITE_SUPABASE_API_KEY;

export function OrgPage() {
  const { orgId } = useParams();

  const {
    data: organization,
    refetch,
  } = useOrganization(orgId!);

  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'member' | 'admin' | 'all'>('member');
  const [search, setSearch] = useState<string>("")
  const [inviteLoading, setInviteLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 6;

  const members = organization?.organization_members ?? [];
  const organization_meta = getOrgMeta(organization?.type ?? "business");

  const counts = useMemo(() => {
    return {
      all: members.length,
      accepted: members.filter((m: any) => m.status?.toLowerCase() === 'active').length,
      invited: members.filter((m: any) => m.status?.toLowerCase() === 'invited').length,
    };
  }, [members]);

  const filteredMembers = useMemo(() => {
    return members.filter((member: any) => {

        const matchesSearch = 
        member.email?.toLowerCase().includes(search.toLowerCase()) ||
        member.name?.toLowerCase().includes(search.toLowerCase());

      const matchesRole = role === 'all' || member.role?.toLowerCase() === role.toLowerCase();

      const matchesTab = currentTab === 'all' || member.status?.toLowerCase() === currentTab.toLowerCase();

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

  const handleRoleChange = (val: "all" | "admin" | "member") => {
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

      const {  error } = await supabase.functions.invoke('send-invite', {
        body: {
          organization_id: orgId,
          email,
          role: "member",
        },
        headers: {
        'apiKey': supabaseApiKey,         
      }
      });

      if (error) {
        alert(error.message);
        return;
      }

      setEmail('');

      await refetch();
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <div className="m-5 flex flex-col justify-between gap-2 p-4 bg-white border border-gray-100 rounded-xl shadow-sm max-w-5xl mx-auto">
      <div className="flex justify-start w-full">
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

      <div></div>

      <main className="space-y-5">
        <div className="flex justify-between">
          <div className="flex space-x-4">
            <p className='text-3xl'>
            {organization_meta.icon}
            </p>
            <div>
              <h2 className="text-start">{organization?.name}</h2>
              <p className="text-[12px]">
                Manage your organization members and their access
              </p>
            </div>
          </div>

          <div>
            <Button variant={'default'} className="bg-purple-500">
              <PlusIcon /> Invite
            </Button>
          </div>
        </div>

        <form  onSubmit={handleInvite}>
          <div className="relative">
            <Mail className="absolute top-3 left-2" />
            <input
              placeholder="Enter email address to invite"
              className="w-full p-3 pl-10 border-gray-200 border-2 rounded-md"
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              disabled={inviteLoading}
              variant={'default'}
              className="absolute right-2 top-2 bg-indigo-500 flex space-x-1.5"
            >
              <Send /> 
              {inviteLoading
                 ? "Sending..."
                : "Send Invite"}
            </Button>
          </div>
        </form>

        <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-3 border-b border-gray-100">
          <Tabs defaultValue="all" className="w-full lg:w-auto" value={currentTab} onValueChange={handleTabChange}>
            <TabsList className="bg-transparent gap-2 h-auto p-0 border-b border-transparent rounded-none">
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
                onChange={(e) => (handleSearchChange(e))}
              />
            </div>

            <Select
              defaultValue="all"
              value={role}
              onValueChange={(value) => handleRoleChange(value as 'member' | 'admin')}
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

        <div className="w-full bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <Table className='w-full table-fixed'>
            <TableHeader className="bg-gray-50/70 border-b border-gray-100">
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6 py-3.5 text-xs font-semibold text-gray-500 w-2/7">
                  Member
                </TableHead>
                <TableHead className="text-center text-xs font-semibold text-gray-500">
                  Role
                </TableHead>
                <TableHead className="text-center  text-xs font-semibold text-gray-500">
                  Status
                </TableHead>
                <TableHead className="text-center  text-xs font-semibold text-gray-500">
                  Joined
                </TableHead>
                <TableHead className="pr-6 text-right text-xs font-semibold text-gray-500">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMembers.map((user: OrganizationMember) => {
                const role_meta = getRoleMeta(user.role)
                return (
                <TableRow
                  key={user.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/40 transition-colors"
                >
                  <TableCell className="pl-6 py-4">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full text-white font-bold text-xs flex items-center justify-center uppercase tracking-wider`}>
                    {user.email.at(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">{user.email.split("@").at(0)}</span>
                    <span className="text-xs text-gray-400 font-medium">{user.email}</span>
                  </div>
                </div>
                </TableCell>

                  <TableCell>
                    <Badge
                      className={`px-1.5 py-0.5 rounded-md text-xs font-semibold shadow-none border-none tracking-wide capitalize ${role_meta.roleStyle}`}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide ${role_meta?.statusColor.split(' ').slice(1).join(' ') ?? ""}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${role_meta?.statusColor.split(' ')[0]}`}
                      />
                      {user.status}
                    </span>
                  </TableCell>

                  <TableCell className="text-sm text-gray-500 font-medium">
                    {user.joined_at ? new Date(
                             user.joined_at
                        ).toLocaleDateString() : "-"}
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
              )})}
            </TableBody>
          </Table>

          <div className='flex justify-between'>
              <div className='mt-3 pl-10 text-[13px]'>
               {filteredMembers.length > 0 ?  
                 <> Showing {(activePage-1)*6 + 1} to {Math.min((activePage-1)*6 +6,filteredMembers.length)} entires of {filteredMembers.length} </>
                  :
                 <></>
               }
              </div>
              <div className='pr-10 pb-3'>
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
                        ? "border-indigo-600 bg-indigo-50 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-600 font-bold"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
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
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={activePage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              </div>
              </div>
            </div>
      </main>
    </div>
  );
}
