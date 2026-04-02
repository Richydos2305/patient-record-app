import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Input } from '../components/forms/Input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { profileUpdateSchema, type ProfileUpdateData } from '../utils/validation';

export function Profile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileUpdateData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      companyName: '',
      companyLogo: '',
      primaryColor: '#667eea',
    },
  });

  // Load user data on mount
  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName,
        phoneNumber: user.phoneNumber || '',
        companyName: user.companyName || '',
        companyLogo: user.companyLogo || '',
        primaryColor: user.primaryColor || '#667eea',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileUpdateData) => {
    setIsSubmitting(true);
    try {
      // Strip empty optional fields so the backend doesn't receive empty strings
      const payload: ProfileUpdateData = { fullName: data.fullName };
      if (data.phoneNumber) payload.phoneNumber = data.phoneNumber;
      if (data.companyName) payload.companyName = data.companyName;
      if (data.companyLogo) payload.companyLogo = data.companyLogo;
      if (data.primaryColor) payload.primaryColor = data.primaryColor;

      await updateUser(payload);
      
      // Apply theme color if changed
      if (data.primaryColor) {
        document.documentElement.style.setProperty('--primary', data.primaryColor);
      }

      addToast({
        type: 'success',
        message: 'Profile updated successfully!',
      });
    } catch (error) {
      addToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to update profile',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="-ml-4 mb-4"
            aria-label="Back to dashboard"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and business branding
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Business Branding Section — Coming Soon */}
          <div className="relative">
            <Card className="opacity-50 pointer-events-none select-none">
              <CardHeader>
                <CardTitle>Business Branding</CardTitle>
                <CardDescription>
                  Customize your company name and logo to personalize the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-10 bg-muted rounded" />
                <div className="h-24 bg-muted rounded" />
              </CardContent>
            </Card>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-1.5 rounded-full shadow">
                Coming Soon
              </span>
            </div>
          </div>

          {/* Personal Information Section */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  {...register('fullName')}
                  error={errors.fullName?.message}
                  required
                />
              </div>
              
              <Input
                label="Phone Number"
                type="tel"
                {...register('phoneNumber')}
                error={errors.phoneNumber?.message}
                placeholder="+234 (803) 000-0000"
              />
            </CardContent>
          </Card>

          {/* Theme Customization Section — Coming Soon */}
          <div className="relative">
            <Card className="opacity-50 pointer-events-none select-none">
              <CardHeader>
                <CardTitle>Theme Customization</CardTitle>
                <CardDescription>
                  Personalize the application colors to match your brand
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-10 bg-muted rounded" />
                <div className="h-16 bg-muted rounded" />
              </CardContent>
            </Card>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-1.5 rounded-full shadow">
                Coming Soon
              </span>
            </div>
          </div>

          <Separator />

          {/* Form Actions */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
