"use client"

import { Link } from 'react-router-dom';
import { useState } from 'react';
import { siteApi } from '@/api';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  YoutubeIcon,
  TiktokIcon,
} from 'lucide-react';

interface FooterProps {
  siteName?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
}

export default function MinimalFooter({
  siteName = 'CasseoHair',
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

  const shopLinks = [
    {
      title: 'All Products',
      href: '/shop',
    },
    {
      title: 'New Arrivals',
      href: '/shop?filter=new-arrivals',
    },
    {
      title: 'Best Sellers',
      href: '/shop?filter=bestsellers',
    },
  ];

  const companyLinks = [
    {
      title: 'About',
      href: '/about',
    },
    {
      title: 'Contact',
      href: '/contact',
    },
  ];

  const legalLinks = [
    {
      title: 'Privacy Policy',
      href: '/privacy',
    },
    {
      title: 'Terms of Service',
      href: '/terms',
    },
    {
      title: 'Refund Policy',
      href: '/refund',
    },
  ];

  const socialLinks = [
    {
      icon: <InstagramIcon className="size-4" />,
      link: instagramUrl || '#',
      name: 'Instagram',
    },
    {
      icon: <FacebookIcon className="size-4" />,
      link: facebookUrl || '#',
      name: 'Facebook',
    },
    {
      icon: <TwitterIcon className="size-4" />,
      link: twitterUrl || '#',
      name: 'Twitter',
    },
    {
      icon: <TiktokIcon className="size-4" />,
      link: tiktokUrl || '#',
      name: 'TikTok',
    },
    {
      icon: <YoutubeIcon className="size-4" />,
      link: youtubeUrl || '#',
      name: 'YouTube',
    },
  ].filter((item) => item.link !== '#');

  return (
    <footer className="relative bg-brand-accent text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        {/* Newsletter Section */}
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
            <form onSubmit={handleSubscribe} className="mx-auto flex max-w-md gap-2">
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
                className="rounded-full bg-brand-pink px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-pink/90 disabled:opacity-50"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>

        {/* Main Footer Content */}
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand Section */}
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

          {/* Shop Links */}
          <div className="md:col-span-1">
            <span className="mb-3 block text-xs font-semibold text-white/60">
              Shop
            </span>
            <div className="flex flex-col gap-2">
              {shopLinks.map(({ href, title }, i) => (
                <Link
                  key={i}
                  to={href}
                  className="w-max py-1 text-sm text-white/60 transition-colors duration-200 hover:text-brand-pink hover:underline"
                >
                  {title}
                </Link>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div className="md:col-span-1">
            <span className="mb-3 block text-xs font-semibold text-white/60">
              Company
            </span>
            <div className="flex flex-col gap-2">
              {companyLinks.map(({ href, title }, i) => (
                <Link
                  key={i}
                  to={href}
                  className="w-max py-1 text-sm text-white/60 transition-colors duration-200 hover:text-brand-pink hover:underline"
                >
                  {title}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal Links */}
          <div className="md:col-span-1">
            <span className="mb-3 block text-xs font-semibold text-white/60">
              Legal
            </span>
            <div className="flex flex-col gap-2">
              {legalLinks.map(({ href, title }, i) => (
                <Link
                  key={i}
                  to={href}
                  className="w-max py-1 text-sm text-white/60 transition-colors duration-200 hover:text-brand-pink hover:underline"
                >
                  {title}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="mt-8 flex justify-center gap-3">
            {socialLinks.map((item, i) => (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-white/20 p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-brand-pink"
                aria-label={item.name}
              >
                {item.icon}
              </a>
            ))}
          </div>
        )}

        {/* Copyright */}
        <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-white/30">
          © {year} {siteName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
