import { Link } from 'react-router-dom';
import { useState } from 'react';
import { siteApi } from '@/api';

interface FooterProps {
  siteName?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
}

export default function Footer({
  siteName = 'CasseoHair',
  instagramUrl,
  facebookUrl,
  twitterUrl,
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

  return (
    <footer className="bg-brand-accent text-white">
      <div className="section-padding max-w-7xl mx-auto">
        {/* Newsletter */}
        <div className="text-center mb-10 pb-10 border-b border-white/10">
          <h3 className="text-xl font-display font-semibold mb-2">Join Our Luxury Circle</h3>
          <p className="text-white/60 text-sm mb-6">Exclusive access to new arrivals, promotions & launches</p>
          {subscribed ? (
            <p className="text-brand-pink font-medium">Thank you for subscribing!</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 outline-none focus:border-brand-pink text-sm"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary text-sm px-6 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt={siteName} className="h-8 mb-4 brightness-0 invert" />
            <p className="text-white/50 text-sm leading-relaxed">
              Premium luxury wigs and hair extensions sourced globally.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Shop</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link to="/shop" className="hover:text-brand-pink transition-colors">All Products</Link></li>
              <li><Link to="/shop?filter=new-arrivals" className="hover:text-brand-pink transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop?filter=bestsellers" className="hover:text-brand-pink transition-colors">Best Sellers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link to="/about" className="hover:text-brand-pink transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-brand-pink transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link to="/privacy" className="hover:text-brand-pink transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-brand-pink transition-colors">Terms of Service</Link></li>
              <li><Link to="/refund" className="hover:text-brand-pink transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        {(instagramUrl || facebookUrl || twitterUrl) && (
          <div className="flex justify-center gap-4 mb-8">
            {instagramUrl && (
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-brand-pink transition-colors">
                Instagram
              </a>
            )}
            {facebookUrl && (
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-brand-pink transition-colors">
                Facebook
              </a>
            )}
            {twitterUrl && (
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-brand-pink transition-colors">
                Twitter
              </a>
            )}
          </div>
        )}

        <div className="text-center text-xs text-white/30 pt-6 border-t border-white/10">
          © {new Date().getFullYear()} {siteName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
