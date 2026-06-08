import '@supabase/functions-js/edge-runtime.d.ts';
import { withSupabase } from '@supabase/server';
import { z } from 'zod';

const InviteSchema = z.object({
  organization_id: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(['member', 'admin']).default('member'),
});

export default {
  fetch: withSupabase({ auth: ['publishable'] }, async (req, ctx) => {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }
    const token = req.headers.get('authorization')?.replace('Bearer ', '');

    const { data: authData, error: authError } =
      await ctx.supabase.auth.getUser(token);

    const user = authData?.user;

    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const body = await req.json();

      const parsed = InviteSchema.safeParse(body);

      if (!parsed.success) {
        return Response.json(
          {
            error: 'Validation failed',
            details: parsed.error.flatten(),
          },
          { status: 400 },
        );
      }

      const { organization_id, email, role } = parsed.data;

      const normalizedEmail = email.trim().toLowerCase();

      const { data: organization } = await ctx.supabaseAdmin
        .from('organizations')
        .select('id, created_by')
        .eq('id', organization_id)
        .single();

      if (!organization) {
        return Response.json(
          { error: 'Organization not found' },
          { status: 404 },
        );
      }

      if (organization.created_by !== user.id) {
        return Response.json({ error: 'Forbidden' }, { status: 403 });
      }

      const { data: memberData, error: memberError } = await ctx.supabaseAdmin
        .from('organization_members')
        .insert({
          organization_id,
          email: normalizedEmail,
          role,
          status: 'invited',
        })
        .select()
        .single();

      if (memberError) {
        if (memberError.code === '23505') {
          return Response.json(
            {
              error: 'Invitation already exists for this email',
            },
            { status: 409 },
          );
        }

        return Response.json(
          {
            error: memberError.message,
          },
          { status: 500 },
        );
      }

      return Response.json(
        { memberData, message: 'Invited!' },
        {
          status: 201,
        },
      );
    } catch (error) {
      console.error(error);

      return Response.json(
        {
          error: 'Internal server error',
        },
        {
          status: 500,
        },
      );
    }
  }),
};
