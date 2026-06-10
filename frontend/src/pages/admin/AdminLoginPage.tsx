import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authApi } from '@/api';
import { useAuthStore } from '@/store/authStore';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { setTokens } = useAuthStore();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = async (data: { username: string; password: string }) => {
    setError('');
    try {
      const res = await authApi.login(data.username, data.password);
      setTokens(res.data.access, res.data.refresh);
      navigate('/admin-dashboard');
    } catch {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-card shadow-luxury p-8">
        <div className="text-center mb-8">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="CasseoHair" className="h-8 mx-auto mb-4" />
          <h1 className="text-lg font-display font-semibold">Admin Dashboard</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Username</label>
            <input {...register('username')} className="input-luxury" autoComplete="username" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Password</label>
            <input {...register('password')} type="password" className="input-luxury" autoComplete="current-password" />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
