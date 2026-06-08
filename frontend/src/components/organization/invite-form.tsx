import { Mail, Send } from 'lucide-react';
import { Button } from '../ui/button';
import type React from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useState } from 'react';
import type { useOrganization } from '@/lib/organiztion/organization-detail-hook';

interface SendInviteFormProps {
  orgId: string | undefined;
  refetch: ReturnType<typeof useOrganization>['refetch'];
}
const supabaseApiKey = import.meta.env.VITE_SUPABASE_API_KEY;

export const SendInviteForm: React.FC<SendInviteFormProps> = ({
  orgId,
  refetch,
}) => {
  const [email, setEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);

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
  );
};
