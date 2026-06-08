import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { useAuthContext } from '@/lib/auth/auth-context';
import { toast } from 'sonner';
import {
  organizationFormSchema,
  type OrganizationFormType,
} from '@/lib/types/orgainzation-types';
import { CreateOrganizationForm } from '@/components/create-organization/form';
import { DetailBanner } from '@/components/create-organization/form-detail-banner';

export function CreateOrganization() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const form = useForm<OrganizationFormType>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      organizationName: '',
      organizationType: 'business',
      schoolDistrict: '',
    },
  });

  const selectedType = useWatch({
    control: form.control,
    name: 'organizationType',
  });

  type FormValues = z.infer<typeof organizationFormSchema>;

  async function onSubmit(values: FormValues) {
    setIsLoading(true);

    const submitData = {
      name: values.organizationName,
      type: values.organizationType,
      school_district:
        values.organizationType === 'school'
          ? values.schoolDistrict || null
          : null,
      created_at: new Date().toISOString(),
      created_by: user?.id,
    };

    try {
      const { error } = await supabase
        .from('organizations')
        .insert([submitData])
        .select()
        .single();

      if (error) toast.error(error.message);
      else {
        toast.success('Organization Created!');
      }

      navigate('/dashboard');
    } catch (error: string | unknown) {
      console.error('Supabase submission payload error:', error);
      toast.error('Some Error Occurred', {
        description: 'Failed To create Organization',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="my-5 flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto w-full px-4 items-start">
      <div className="flex flex-col gap-6 p-4 sm:p-6 bg-white border border-gray-100 rounded-xl shadow-sm flex-1 min-w-0 w-full">
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
                  <Link to="#">Organizations</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <CreateOrganizationForm
          form={form}
          isLoading={isLoading}
          onSubmit={onSubmit}
          selectedType={selectedType}
          key="create-org-form"
        />
      </div>

      <DetailBanner />
    </div>
  );
}
