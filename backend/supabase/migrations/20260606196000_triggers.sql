CREATE OR REPLACE FUNCTION public.handle_new_organization()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.organization_members (
        organization_id,
        user_id,
        email,
        status,
        role,
        invited_at,
        joined_at
    ) VALUES (
        NEW.id,
        NEW.created_by,
        (SELECT email FROM auth.users WHERE id = NEW.created_by),
        'active'::member_status,  
        'owner'::member_role,
        NEW.created_at,
        NEW.created_at
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_organization_created
    AFTER INSERT ON public.organizations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_organization();