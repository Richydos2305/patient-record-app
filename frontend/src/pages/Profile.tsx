import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Input } from '../components/forms/Input';
import { ImageUpload } from '../components/forms/ImageUpload';
import { Button } from '@/components/ui/button';
import { Input as ShadcnInput } from '@/components/ui/input';
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
    setValue,
    watch,
  } = useForm<ProfileUpdateData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      companyName: '',
      companyLogo: '',
      primaryColor: '#667eea',
    },
  });

  // Watch logo and color for controlled updates
  const companyLogo = watch('companyLogo');
  const primaryColor = watch('primaryColor');

  // Load user data on mount
  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName,
        email: user.email,
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
      await updateUser(data);
      
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
          {/* Business Branding Section */}
          <Card>
            <CardHeader>
              <CardTitle>Business Branding</CardTitle>
              <CardDescription>
                Customize your company name and logo to personalize the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Company Name"
                {...register('companyName')}
                error={errors.companyName?.message}
                placeholder="Your Pharmacy Name"
              />

              <ImageUpload
                label="Company Logo"
                value={companyLogo}
                onChange={(base64) => setValue('companyLogo', base64 || '')}
                error={errors.companyLogo?.message}
                maxSizeMB={2}
              />

              <div className="text-sm text-muted-foreground">
                Your logo will appear in the navigation header and on login pages
              </div>
            </CardContent>
          </Card>

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
                <Input
                  label="Email Address"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
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

          {/* Theme Customization Section */}
          <Card>
            <CardHeader>
              <CardTitle>Theme Customization</CardTitle>
              <CardDescription>
                Personalize the application colors to match your brand
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="primaryColor" className="text-sm font-medium">
                  Primary Brand Color
                </label>
                <div className="flex items-center gap-4">
                  <input
                    id="primaryColor"
                    type="color"
                    {...register('primaryColor')}
                    className="h-10 w-20 rounded border border-border cursor-pointer"
                  />
                  <ShadcnInput
                    type="text"
                    {...register('primaryColor')}
                    placeholder="#667eea"
                    className={`flex-1 ${errors.primaryColor ? 'border-destructive' : ''}`}
                    aria-invalid={!!errors.primaryColor}
                    aria-describedby={errors.primaryColor ? 'primaryColor-error' : undefined}
                  />
                </div>
                {errors.primaryColor && (
                  <p id="primaryColor-error" className="text-sm text-destructive" role="alert">
                    {errors.primaryColor.message}
                  </p>
                )}
              </div>

              <div className="p-4 rounded-lg border border-border bg-muted">
                <p className="text-sm text-muted-foreground mb-3">Preview:</p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    style={{
                      backgroundColor: primaryColor,
                      borderColor: primaryColor,
                    }}
                  >
                    Primary Button
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    style={{
                      borderColor: primaryColor,
                      color: primaryColor,
                    }}
                  >
                    Outline Button
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

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
