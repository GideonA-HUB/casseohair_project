import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import SEO from '@/components/SEO';
import { siteApi } from '@/api';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setError('');
    try {
      await siteApi.contact(data);
      setSubmitted(true);
      reset();
    } catch {
      setError('Failed to send message. Please try again.');
    }
  };

  return (
    <>
      <SEO title="Contact Us" description="Get in touch with CasseoHair" />
      <div className="section-padding max-w-lg mx-auto">
        <h1 className="text-2xl font-display font-semibold mb-2">Contact Us</h1>
        <p className="text-brand-accent/60 text-sm mb-8">We'd love to hear from you</p>

        {submitted ? (
          <div className="text-center py-12 bg-brand-gray-50 rounded-card">
            <p className="text-brand-pink font-medium mb-2">Message Sent!</p>
            <p className="text-sm text-brand-accent/60">We'll get back to you shortly.</p>
            <button onClick={() => setSubmitted(false)} className="btn-outline text-sm mt-6">
              Send Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Name</label>
              <input {...register('name')} className="input-luxury" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <input {...register('email')} type="email" className="input-luxury" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Phone (optional)</label>
              <input {...register('phone')} className="input-luxury" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Message</label>
              <textarea {...register('message')} rows={5} className="input-luxury resize-none" />
              {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
