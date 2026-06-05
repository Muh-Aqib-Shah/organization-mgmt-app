-- Initial schema for the admin organizations app
create extension if not exists "pgcrypto";
create extension if not exists "citext";

create type org_type as enum ('school', 'nonprofit', 'business');
create type member_status as enum ('invited', 'active');
create type member_role as enum ('member', 'admin');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  is_admin boolean not null default false
);

create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type org_type not null,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  extra_info text
);

create table organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid references auth.users(id),
  email citext not null,
  status member_status not null default 'invited',
  role member_role not null default 'member',
  invited_at timestamptz not null default now(),
  joined_at timestamptz,
  constraint organization_member_unique_email unique (organization_id, email)
);

alter table organization_members
  add constraint organization_members_email_check check (email <> '');
