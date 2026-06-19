import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

interface SiteSettings {
  id: number;
  site_name: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  whatsapp_number: string;
  instagram_url: string;
  facebook_url: string;
  twitter_url: string;
  tiktok_url: string;
  youtube_url: string;
  delivery_fee: number;
  currency: string;
  currency_symbol: string;
  is_vat_inclusive: boolean;
  vat_rate: number;
  privacy_policy: string;
  terms_of_service: string;
  refund_policy: string;
  why_choose_title: string;
  why_choose_subtitle: string;
}

export default function AdminSettings() {
  const [formData, setFormData] = useState<Partial<SiteSettings>>({});
  const [saving, setSaving] = useState(false);

  const { data: settings, isLoading, refetch } = useQuery<SiteSettings>({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const token = localStorage.getItem('access_token');
      const response = await fetch('/api/v1/site/admin/settings/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch settings');
      return response.json();
    },
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('access_token');
      await fetch('/api/v1/site/admin/settings/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      refetch();
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof SiteSettings, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-pink border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-2xl font-bold text-brand-black">Site Settings</h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={saving}
          className="bg-brand-pink text-white font-semibold py-2.5 px-6 rounded-xl hover:bg-brand-pink/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </motion.button>
      </motion.div>

      {/* General Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-brand-gray-100"
      >
        <h3 className="text-lg font-semibold text-brand-black mb-4">General Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-accent mb-2">Site Name</label>
            <input
              type="text"
              defaultValue={settings?.site_name}
              onChange={(e) => handleInputChange('site_name', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-accent mb-2">Contact Email</label>
            <input
              type="email"
              defaultValue={settings?.contact_email}
              onChange={(e) => handleInputChange('contact_email', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-accent mb-2">Contact Phone</label>
            <input
              type="text"
              defaultValue={settings?.contact_phone}
              onChange={(e) => handleInputChange('contact_phone', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-accent mb-2">WhatsApp Number</label>
            <input
              type="text"
              defaultValue={settings?.whatsapp_number}
              onChange={(e) => handleInputChange('whatsapp_number', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-brand-accent mb-2">Site Description</label>
          <textarea
            defaultValue={settings?.site_description}
            onChange={(e) => handleInputChange('site_description', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all resize-none"
            rows={3}
          />
        </div>
      </motion.div>

      {/* Social Media */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-brand-gray-100"
      >
        <h3 className="text-lg font-semibold text-brand-black mb-4">Social Media</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-accent mb-2">Instagram URL</label>
            <input
              type="url"
              defaultValue={settings?.instagram_url}
              onChange={(e) => handleInputChange('instagram_url', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-accent mb-2">Facebook URL</label>
            <input
              type="url"
              defaultValue={settings?.facebook_url}
              onChange={(e) => handleInputChange('facebook_url', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-accent mb-2">Twitter URL</label>
            <input
              type="url"
              defaultValue={settings?.twitter_url}
              onChange={(e) => handleInputChange('twitter_url', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-accent mb-2">TikTok URL</label>
            <input
              type="url"
              defaultValue={settings?.tiktok_url}
              onChange={(e) => handleInputChange('tiktok_url', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-accent mb-2">YouTube URL</label>
            <input
              type="url"
              defaultValue={settings?.youtube_url}
              onChange={(e) => handleInputChange('youtube_url', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all"
            />
          </div>
        </div>
      </motion.div>

      {/* Payment & Currency */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-brand-gray-100"
      >
        <h3 className="text-lg font-semibold text-brand-black mb-4">Payment & Currency</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-accent mb-2">Delivery Fee</label>
            <input
              type="number"
              defaultValue={settings?.delivery_fee}
              onChange={(e) => handleInputChange('delivery_fee', parseFloat(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-accent mb-2">Currency</label>
            <input
              type="text"
              defaultValue={settings?.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-accent mb-2">Currency Symbol</label>
            <input
              type="text"
              defaultValue={settings?.currency_symbol}
              onChange={(e) => handleInputChange('currency_symbol', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-accent mb-2">VAT Rate (%)</label>
            <input
              type="number"
              defaultValue={settings?.vat_rate}
              onChange={(e) => handleInputChange('vat_rate', parseFloat(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              defaultChecked={settings?.is_vat_inclusive}
              onChange={(e) => handleInputChange('is_vat_inclusive', e.target.checked)}
              className="w-5 h-5 rounded border border-brand-gray-200 text-brand-pink focus:ring-brand-pink"
            />
            <span className="text-sm text-brand-accent">VAT Inclusive</span>
          </label>
        </div>
      </motion.div>

      {/* Why Choose Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-brand-gray-100"
      >
        <h3 className="text-lg font-semibold text-brand-black mb-4">Why Choose Section</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-accent mb-2">Title</label>
            <input
              type="text"
              defaultValue={settings?.why_choose_title}
              onChange={(e) => handleInputChange('why_choose_title', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-accent mb-2">Subtitle</label>
            <input
              type="text"
              defaultValue={settings?.why_choose_subtitle}
              onChange={(e) => handleInputChange('why_choose_subtitle', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
