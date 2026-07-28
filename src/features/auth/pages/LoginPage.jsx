import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, FormField, Input } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/app/providers/AuthProvider';
import { loginSchema } from '../schemas/loginSchema';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values) => {
    setFormError(null);
    try {
      await login(values);
      navigate(location.state?.from?.pathname ?? ROUTES.ADMIN_DASHBOARD, {
        replace: true,
      });
    } catch (error) {
      // Map Laravel 422 field errors back onto the form.
      if (error.isValidation) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          setError(field, { message: Array.isArray(messages) ? messages[0] : messages });
        });
        return;
      }
      setFormError(error.message);
    }
  };

  return (
    <Card>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {formError && (
            <p role="alert" className="rounded-token bg-danger/10 px-3 py-2 text-sm text-danger">
              {formError}
            </p>
          )}

          <FormField label="Email" error={errors.email?.message} required>
            {(field) => (
              <Input
                {...field}
                {...register('email')}
                type="email"
                autoComplete="username"
                placeholder="you@business.ph"
              />
            )}
          </FormField>

          <FormField label="Password" error={errors.password?.message} required>
            {(field) => (
              <Input
                {...field}
                {...register('password')}
                type="password"
                autoComplete="current-password"
              />
            )}
          </FormField>

          <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
            Sign in
          </Button>
        </form>

        {import.meta.env.VITE_USE_MOCK_API === 'true' && (
          <p className="mt-4 rounded-token bg-surface-muted px-3 py-2 text-xs text-content-muted">
            Mock API is on. Sign in with <strong>owner@demo.test</strong> /{' '}
            <strong>password</strong>.
          </p>
        )}
      </CardBody>
    </Card>
  );
}
