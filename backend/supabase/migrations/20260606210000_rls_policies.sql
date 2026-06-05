-- Row Level Security policies for the admin organizations app
alter table profiles enable row level security;
alter table organizations enable row level security;
alter table organization_members enable row level security;

create policy profiles_select_own_profile
  on profiles
  for select
  using (auth.uid() = id);

create policy profiles_update_own_profile
  on profiles
  for update
  using (auth.uid() = id);

create policy organizations_manage_own_orgs
  on organizations
  for all
  using (auth.uid() = created_by);

create policy organization_members_manage_by_org_admin
  on organization_members
  for all
  using (
    exists (
      select 1
      from organizations
      where organizations.id = organization_members.organization_id
        and organizations.created_by = auth.uid()
    )
  );
