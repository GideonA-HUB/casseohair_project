"use client"

import { Link } from 'react-router-dom';
import { useState } from 'react';
import { siteApi } from '@/api';
import { BRAND_EMAIL, BRAND_INSTAGRAM, BRAND_TIKTOK } from '@/constants/brand';

interface FooterProps {
  siteName?: string;
  contactEmail?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

function EmailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

export default function MinimalFooter({
  siteName = 'CasseoHair',
  contactEmail,
  instagramUrl,
  facebookUrl,
  twitterUrl,
  tiktokUrl,
  youtubeUrl,
}: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await siteApi.newsletter(email);
      setSubscribed(true);
      setEmail('');
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  };

  const year = new Date().getFullYear();
  const resolvedEmail = contactEmail || BRAND_EMAIL;
  const resolvedInstagram = instagramUrl || BRAND_INSTAGRAM;
  const resolvedTiktok = tiktokUrl || BRAND_TIKTOK;

  const shopLinks = [
    { title: 'All Products', href: '/shop' },
    { title: 'New Arrivals', href: '/shop?filter=new-arrivals' },
    { title: 'Best Sellers', href: '/shop?filter=bestsellers' },
    { title: 'Flash Sales', href: '/shop?filter=flash-sales' },
  ];

  const companyLinks = [
    { title: 'About', href: '/about' },
    { title: 'Contact', href: '/contact' },
  ];

  const legalLinks = [
    { title: 'Privacy Policy', href: '/privacy' },
    { title: 'Terms of Service', href: '/terms' },
    { title: 'Refund Policy', href: '/refund' },
  ];

  const socialLinks = [
    {
      href: resolvedInstagram,
      label: 'Instagram',
      icon: <InstagramIcon className="h-5 w-5" />,
    },
    {
      href: resolvedTiktok,
      label: 'TikTok',
      icon: <TikTokIcon className="h-5 w-5" />,
    },
    {
      href: `mailto:${resolvedEmail}`,
      label: 'Email',
      icon: <EmailIcon className="h-5 w-5" />,
    },
    ...(facebookUrl
      ? [{ href: facebookUrl, label: 'Facebook', icon: <span className="text-xs font-semibold">f</span> }]
      : []),
    ...(twitterUrl
      ? [{ href: twitterUrl, label: 'Twitter', icon: <span className="text-xs font-semibold">X</span> }]
      : []),
    ...(youtubeUrl
      ? [{ href: youtubeUrl, label: 'YouTube', icon: <span className="text-xs font-semibold">YT</span> }]
      : []),
  ];

  return (
    <footer className="relative bg-brand-accent text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <div className="mb-12 border-b border-white/10 pb-10 text-center">
          <h3 className="mb-2 text-xl font-display font-semibold text-brand-pink">
            Join Our Luxury Circle
          </h3>
          <p className="mb-6 text-sm text-white/60">
            Exclusive access to new arrivals, promotions & launches
          </p>
          {subscribed ? (
            <p className="font-medium text-brand-pink">Thank you for subscribing!</p>
          ) : (
            <form onSubmit={handleSubscribe} className="mx-auto flex max-w-md flex-col gap-2 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-brand-pink"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-brand-pink px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-pink/90 disabled:opacity-50 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link to="/" className="mb-4 inline-block">
              <img
                src={`${import.meta.env.BASE_URL}logo.png`}
                alt={siteName}
                className="h-8 brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-white/50 leading-relaxed">
              Premium luxury wigs and hair extensions sourced globally.
            </p>
          </div>

          <div className="md:col-span-1">
            <span className="mb-3 block text-xs font-semibold text-white/60">Shop</span>
            <div className="flex flex-col gap-2">
              {shopLinks.map(({ href, title }) => (
                <Link
                  key={href}
                  to={href}
                  className="w-max py-1 text-sm text-white/60 transition-colors duration-200 hover:text-brand-pink hover:underline"
                >
                  {title}
                </Link>
              ))}
            </div>
          </div>

          <div className="md:col-span-1">
            <span className="mb-3 block text-xs font-semibold text-white/60">Company</span>
            <div className="flex flex-col gap-2">
              {companyLinks.map(({ href, title }) => (
                <Link
                  key={href}
                  to={href}
                  className="w-max py-1 text-sm text-white/60 transition-colors duration-200 hover:text-brand-pink hover:underline"
                >
                  {title}
                </Link>
              ))}
            </div>
          </div>

          <div className="md:col-span-1">
            <span className="mb-3 block text-xs font-semibold text-white/60">Legal</span>
            <div className="flex flex-col gap-2">
              {legalLinks.map(({ href, title }) => (
                <Link
                  key={href}
                  to={href}
                  className="w-max py-1 text-sm text-white/60 transition-colors duration-200 hover:text-brand-pink hover:underline"
                >
                  {title}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
            Connect With Us
          </span>
          <div className="flex items-center justify-center gap-3">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith('mailto:') ? undefined : '_blank'}
                rel={item.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-all hover:border-brand-pink hover:bg-brand-pink/10 hover:text-brand-pink"
                aria-label={item.label}
                title={item.label}
              >
                {item.icon}
              </a>
            ))}
          </div>
          <a
            href={`mailto:${resolvedEmail}`}
            className="text-sm text-white/50 transition-colors hover:text-brand-pink"
          >
            {resolvedEmail}
          </a>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-white/30">
          © {year} {siteName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
