import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export default function AdminContacts() {
  const { data: contacts, isLoading } = useQuery<ContactSubmission[]>({
    queryKey: ['admin-contacts'],
    queryFn: async () => {
      const token = localStorage.getItem('access_token');
      const response = await fetch('/api/v1/site/contacts/admin/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch contacts');
      return response.json();
    },
  });

  const markAsRead = async (contactId: number) => {
    const token = localStorage.getItem('access_token');
    await fetch(`/api/v1/site/contacts/${contactId}/read/`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Refetch contacts
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-2xl font-bold text-brand-black">Contact Submissions</h1>
      </motion.div>

      {/* Contacts List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-pink border-t-transparent" />
          </div>
        ) : contacts && contacts.length > 0 ? (
          contacts.map((contact, index) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-2xl shadow-lg border p-6 ${
                !contact.is_read ? 'border-brand-pink' : 'border-brand-gray-100'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-brand-black">{contact.name}</h3>
                  <p className="text-sm text-brand-accent/60">{contact.email}</p>
                  {contact.phone && <p className="text-sm text-brand-accent/60">{contact.phone}</p>}
                </div>
                <div className="flex gap-2">
                  {!contact.is_read && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => markAsRead(contact.id)}
                      className="bg-brand-pink text-white px-4 py-2 rounded-lg hover:bg-brand-pink/90 transition-colors"
                    >
                      Mark as Read
                    </motion.button>
                  )}
                  <a
                    href={`mailto:${contact.email}`}
                    className="bg-brand-gray-100 text-brand-accent px-4 py-2 rounded-lg hover:bg-brand-gray-200 transition-colors"
                  >
                    Reply
                  </a>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-brand-accent mb-1">Subject</p>
                <p className="text-brand-black">{contact.subject}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-brand-accent mb-1">Message</p>
                <p className="text-brand-accent">{contact.message}</p>
              </div>
              <p className="text-xs text-brand-accent/40 mt-4">
                {new Date(contact.created_at).toLocaleString()}
              </p>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12 text-brand-accent/60">
            No contact submissions found
          </div>
        )}
      </motion.div>
    </div>
  );
}
