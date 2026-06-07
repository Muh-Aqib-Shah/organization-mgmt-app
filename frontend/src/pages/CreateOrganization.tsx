import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Building2Icon,
  GraduationCap,
  Heart,
  Loader2,
  Mail,
  MapPin,
  ShieldCheck,
  Users2,
  Zap,
} from 'lucide-react';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm, useWatch } from 'react-hook-form';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import backSupportImage from '@/assets/backdrop.png';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { useAuthContext } from '@/lib/auth/auth-context';

const organizationFormSchema = z.object({
  organizationName: z.string().min(2, {
    message: 'Organization name must be at least 2 characters.',
  }),
  organizationType: z.enum(['school', 'nonprofit', 'business']),
  schoolDistrict: z.string().nullable().optional(),
});

export function CreateOrganization() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const form = useForm<z.infer<typeof organizationFormSchema>>({
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
      const { data, error } = await supabase
        .from('organizations')
        .insert([submitData])
        .select()
        .single();

      if (error) throw error;

      //toast.success("Organization created successfully!");
      console.log('DATA: ', data);

      navigate('/dashboard');
    } catch (error: string | unknown) {
      console.error('Supabase submission payload error:', error);
      // toast.error(error.message || "Failed to create organization. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const typeCards = [
    {
      id: 'nonprofit',
      label: 'Nonprofit',
      description:
        'Organizations focused on social impact and community welfare.',
      icon: Heart,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      id: 'school',
      label: 'School',
      description: 'Educational institutions and academic organizations.',
      icon: GraduationCap,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      id: 'business',
      label: 'Business',
      description: 'For-profit companies and commercial organizations.',
      icon: Briefcase,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
  ] as const;

  return (
    <div className="my-5 flex gap-6 max-w-6xl mx-auto w-full px-4 items-start">
      <div className="flex flex-col gap-6 p-6 bg-white border border-gray-100 rounded-xl shadow-sm flex-1 min-w-0">
        <div className="flex justify-start w-full">
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

        <main className="space-y-6 w-full">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-gray-900 text-start">
              Create Organization
            </h2>
            <p className="text-xs text-gray-500 text-start">
              Provide the basic information to create a new organization
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 w-full max-w-3xl text-left"
            >
              <FormField
                control={form.control}
                name="organizationName"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1.5 space-y-0">
                    <FormLabel className="text-[14px] font-semibold text-gray-800 tracking-tight flex items-center gap-1">
                      Organization Name{' '}
                      <span className="text-destructive font-medium text-xs">
                        *
                      </span>
                    </FormLabel>

                    <FormDescription className="text-xs text-gray-400 font-normal leading-normal select-none -mt-0.5">
                      Enter a name that represents your organization.
                    </FormDescription>

                    <FormControl>
                      <div className="relative flex items-center w-full group mt-1">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none text-gray-400 group-focus-within:text-gray-600 transition-colors duration-200">
                          <Mail className="w-4 h-4 stroke-[1.75]" />
                        </div>
                        <Input
                          placeholder="e.g. Bright Future Academy"
                          {...field}
                          className="pl-10 h-11 w-full border border-gray-200 bg-white/50 rounded-lg text-sm text-gray-900 placeholder:text-gray-400/80 shadow-none focus-visible:ring-1 focus-visible:ring-indigo-600 focus-visible:border-indigo-600 transition-all duration-200"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs font-medium text-destructive mt-1.5" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="organizationType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <div className="flex flex-col gap-1">
                      <FormLabel className="text-[14px] font-semibold text-gray-800 tracking-tight flex items-center gap-1">
                        Organization Type{' '}
                        <span className="text-destructive text-xs">*</span>
                      </FormLabel>
                      <FormDescription className="text-xs text-gray-400 font-normal leading-normal select-none">
                        Select the type that best describes your organization.
                      </FormDescription>
                    </div>

                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 w-full"
                      >
                        {typeCards.map((card) => {
                          const IconComponent = card.icon;
                          const isSelected = field.value === card.id;

                          return (
                            <label
                              key={card.id}
                              className={`relative flex flex-col justify-between p-5 rounded-xl border bg-white cursor-pointer select-none transition-all duration-200 min-h-40 shadow-sm hover:border-indigo-200 hover:shadow-md/50 ${
                                isSelected
                                  ? 'border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50/10'
                                  : 'border-gray-100'
                              }`}
                            >
                              <RadioGroupItem
                                value={card.id}
                                className="sr-only"
                              />

                              <div className="flex items-center justify-between w-full">
                                <div
                                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.bgColor} shadow-sm`}
                                >
                                  <IconComponent
                                    className={`w-5 h-5 ${card.iconColor} stroke-[1.75]`}
                                  />
                                </div>

                                <div
                                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                                    isSelected
                                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm scale-105'
                                      : 'border-gray-300 bg-white'
                                  }`}
                                >
                                  {isSelected && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-col gap-1 mt-4 text-left">
                                <span className="text-sm font-semibold text-gray-900 tracking-tight">
                                  {card.label}
                                </span>
                                <span className="text-xs text-gray-400 font-medium leading-relaxed">
                                  {card.description}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage className="text-xs font-medium text-destructive pt-1" />
                  </FormItem>
                )}
              />

              {selectedType === 'school' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                  <FormField
                    control={form.control}
                    name="schoolDistrict"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1.5 space-y-0">
                        <FormLabel className="text-[14px] font-semibold text-gray-800 tracking-tight">
                          School District{' '}
                          <span className="text-gray-400 font-normal text-xs">
                            (Optional)
                          </span>
                        </FormLabel>
                        <FormDescription className="text-xs text-gray-400 font-normal leading-normal select-none -mt-0.5">
                          Specify the formal school district administration
                          region name parameters.
                        </FormDescription>
                        <FormControl>
                          <div className="relative flex items-center w-full group mt-1">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-400 group-focus-within:text-gray-600 transition-colors duration-200">
                              <MapPin className="w-4 h-4 stroke-[1.75]" />
                            </div>
                            <Input
                              placeholder="e.g. District 14 Central Administrative Division"
                              value={field.value || ''}
                              onChange={field.onChange}
                              className="pl-10 h-11 w-full border border-gray-200 bg-white/50 rounded-lg text-sm text-gray-900 placeholder:text-gray-400/80 shadow-none focus-visible:ring-1 focus-visible:ring-indigo-600 focus-visible:border-indigo-600 transition-all duration-200"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs font-medium text-destructive mt-1.5" />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium gap-2 rounded-lg transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Building2Icon className="w-4 h-4" />
                      Create Organization
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </main>
      </div>

      <div className="w-full lg:w-90 shrink-0 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col gap-6 lg:sticky lg:top-6">
        <div className="relative w-full aspect-4/3 bg-linear-to-br from-indigo-50 to-slate-50 rounded-xl overflow-hidden flex items-center justify-center border border-gray-50/50">
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[16px_16px] opacity-60" />
          <div className="px-6 py-8 flex-1 flex flex-col items-center justify-center">
            <img
              src={backSupportImage}
              alt="Create Organization"
              className="w-full h-full mb-6 object-contain"
            />
          </div>
        </div>

        <div className="flex flex-col gap-5 text-left">
          <div className="flex gap-3.5 items-start">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-indigo-600 stroke-2" />
            </div>
            <div className="flex flex-col gap-0.5">
              <h4 className="text-sm font-semibold text-gray-900 tracking-tight">
                Secure & Private
              </h4>
              <p className="text-xs text-gray-400 font-medium leading-normal">
                Your organization data is completely encrypted, isolated, and
                safe.
              </p>
            </div>
          </div>

          <div className="flex gap-3.5 items-start">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 shadow-sm">
              <Users2 className="w-4 h-4 text-emerald-600 stroke-2" />
            </div>
            <div className="flex flex-col gap-0.5">
              <h4 className="text-sm font-semibold text-gray-900 tracking-tight">
                Invite Team Members
              </h4>
              <p className="text-xs text-gray-400 font-medium leading-normal">
                Add admins and manage precise role boundaries seamlessly.
              </p>
            </div>
          </div>

          <div className="flex gap-3.5 items-start">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 shadow-sm">
              <Zap className="w-4 h-4 text-amber-600 stroke-2" />
            </div>
            <div className="flex flex-col gap-0.5">
              <h4 className="text-sm font-semibold text-gray-900 tracking-tight">
                Scalable & Flexible
              </h4>
              <p className="text-xs text-gray-400 font-medium leading-normal">
                Easily update settings, modify records, and scale structures.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
