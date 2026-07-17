import { useState } from 'react';
import { Check, Copy, Link2, Share2 } from 'lucide-react';

interface ProductShareProps {
  name: string;
  description?: string;
  /** Absolute product page URL; defaults to current location */
  url?: string;
  /** Compact icon-only control (e.g. product cards) */
  compact?: boolean;
  className?: string;
}

function buildSharePayload(name: string, description: string | undefined, shareUrl: string) {
  const shortDesc = description?.trim()
    ? description.trim().length > 140
      ? `${description.trim().slice(0, 137)}…`
      : description.trim()
    : '';
  const text = shortDesc ? `${name}\n\n${shortDesc}` : name;
  const message = `${text}\n\n${shareUrl}`;
  return { text, message, shareUrl };
}

export default function ProductShare({
  name,
  description,
  url,
  compact = false,
  className = '',
}: ProductShareProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl =
    url ||
    (typeof window !== 'undefined'
      ? window.location.href.split('?')[0].split('#')[0]
      : '');
  const { text, message } = buildSharePayload(name, description, shareUrl);

  const closeSoon = () => {
    window.setTimeout(() => setOpen(false), 150);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = message;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareNative = async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: name, text, url: shareUrl });
        setOpen(false);
        return;
      } catch {
        // User cancelled or share failed — fall through to copy
      }
    }
    await copyLink();
  };

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(message)}`;
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-expanded={open}
        aria-label="Share product"
        className={
          compact
            ? 'flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-brand-black shadow-sm backdrop-blur transition hover:bg-brand-pink hover:text-white dark:bg-brand-black/80 dark:text-white'
            : 'inline-flex items-center gap-2 rounded-full border border-brand-gray-200 px-4 py-2.5 text-sm font-medium text-brand-accent transition hover:border-brand-pink hover:text-brand-pink dark:border-white/15 dark:text-gray-200'
        }
      >
        <Share2 className={compact ? 'h-4 w-4' : 'h-4 w-4'} strokeWidth={2} />
        {!compact && <span>Share</span>}
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-label="Close share menu"
            onClick={() => setOpen(false)}
          />
          <div
            className={`absolute z-50 w-56 rounded-xl border border-brand-gray-100 bg-white p-2 shadow-luxury dark:border-white/10 dark:bg-[#141414] ${
              compact ? 'right-0 top-11' : 'left-0 top-12'
            }`}
            role="menu"
          >
            <p className="px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-brand-accent/50 dark:text-gray-500">
              Share product
            </p>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              onClick={closeSoon}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-brand-black transition hover:bg-brand-pink/10 hover:text-brand-pink dark:text-gray-100"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366]/20 text-[#25D366]">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </span>
              WhatsApp
            </a>

            <a
              href={facebookHref}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              onClick={closeSoon}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-brand-black transition hover:bg-brand-pink/10 hover:text-brand-pink dark:text-gray-100"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1877F2]/15 text-[#1877F2]">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
                </svg>
              </span>
              Facebook
            </a>

            <a
              href={twitterHref}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              onClick={closeSoon}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-brand-black transition hover:bg-brand-pink/10 hover:text-brand-pink dark:text-gray-100"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gray-100 text-brand-black dark:bg-white/10 dark:text-white">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.227-8.26L1.242 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </span>
              X / Twitter
            </a>

            <button
              type="button"
              role="menuitem"
              onClick={copyLink}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-brand-black transition hover:bg-brand-pink/10 hover:text-brand-pink dark:text-gray-100"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-pink/10 text-brand-pink">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </span>
              {copied ? 'Copied!' : 'Copy link & details'}
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={shareNative}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-brand-black transition hover:bg-brand-pink/10 hover:text-brand-pink dark:text-gray-100"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gray-100 text-brand-accent dark:bg-white/10 dark:text-gray-200">
                <Link2 className="h-4 w-4" />
              </span>
              More options
            </button>
          </div>
        </>
      )}
    </div>
  );
}
