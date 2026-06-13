import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import MobileMenu from './MobileMenu';

interface HeaderProps {
  whatsappNumber?: string;
}

export default function Header({ whatsappNumber }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { openCart, getItemCount } = useCartStore();
  const navigate = useNavigate();
  const itemCount = getItemCount();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`
    : '#';

  const iconBtn =
    'p-2 rounded-lg text-white hover:bg-white/10 active:bg-white/15 transition-colors';

  return (
    <>
      {/* Sticky opaque black bar — never transparent so icons stay visible on all sections */}
      <div className="sticky top-0 z-50 bg-brand-black shadow-[0_2px_16px_rgba(0,0,0,0.35)]">
        {/* Utility Bar */}
        <div className="border-b border-white/10 text-xs">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-9">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-green-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Contact Us
            </a>
            <div className="flex items-center gap-1.5 text-white/90">
              <span className="text-sm leading-none">🇳🇬</span>
              <span className="font-medium text-white">NGN</span>
            </div>
          </div>
        </div>

        {/* Main Nav */}
        <header className="border-b border-white/10">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center justify-between h-16 sm:h-[4.5rem]">
            <button
              onClick={() => setMenuOpen(true)}
              className={`${iconBtn} -ml-1`}
              aria-label="Menu"
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <Link
              to="/"
              className="absolute left-1/2 -translate-x-1/2 flex items-center bg-white rounded-lg px-2.5 py-1 sm:px-3 sm:py-1.5 shadow-sm"
            >
              <img
                src={`${import.meta.env.BASE_URL}logo.png`}
                alt="CasseoHair"
                className="h-9 w-auto sm:h-10 md:h-11 max-w-[min(48vw,200px)] object-contain"
              />
            </Link>

            <div className="flex items-center gap-0.5">
              <button onClick={() => setSearchOpen(!searchOpen)} className={iconBtn} aria-label="Search">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button onClick={openCart} className={`${iconBtn} relative`} aria-label="Cart">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] bg-brand-pink text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {searchOpen && (
            <div className="px-4 pb-3 border-t border-white/10 bg-brand-black">
              <form onSubmit={handleSearch}>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search luxury hair..."
                  className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 bg-white text-brand-accent placeholder:text-brand-accent/45 text-sm outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/25"
                  autoFocus
                  autoComplete="off"
                />
              </form>
            </div>
          )}
        </header>
      </div>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
