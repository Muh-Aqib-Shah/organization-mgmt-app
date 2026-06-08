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
import { Badge } from '@/components/ui/badge';

import { Button } from '@/components/ui/button';
import { getRoleMeta } from '@/lib/organiztion/role-meta';
import type { OrganizationMemberType } from '@/lib/types/orgainzation-types';
import { useMemo } from 'react';

interface MemberTableProps {
  filteredMembers: OrganizationMemberType[];
  activePage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const ITEMS_PER_PAGE = 6;

export const MemberTable: React.FC<MemberTableProps> = ({
  activePage,
  filteredMembers,
  setCurrentPage,
  totalPages,
}) => {
  const paginatedMembers = useMemo(() => {
    const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
    return filteredMembers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredMembers, activePage]);
  return (
    <div className="w-full bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      <div className="w-full overflow-x-auto">
        <Table className="w-full min-w-150 table-fixed">
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
  );
};
