'use client';

import { useEffect, useState } from 'react';
import { Check, Link2, Share2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

type BlogShareButtonProps = {
  url: string;
  title: string;
  className?: string;
};

export function BlogShareButton({ url, title, className }: BlogShareButtonProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  const share = async () => {
    try {
      if (canNativeShare) {
        await navigator.share({ title, url, text: title });
        return;
      }
    } catch {
      // cancelado o no disponible → copiar
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void share()}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg border border-white/12 bg-white/5 px-3 py-2 text-sm text-neutral-200 transition-colors hover:bg-white/10 hover:text-white',
        className,
      )}
      aria-label={copied ? t('blog.linkCopied') : t('blog.share')}
    >
      {copied ? (
        <Check className="h-4 w-4" aria-hidden />
      ) : canNativeShare ? (
        <Share2 className="h-4 w-4" aria-hidden />
      ) : (
        <Link2 className="h-4 w-4" aria-hidden />
      )}
      <span>{copied ? t('blog.linkCopied') : t('blog.share')}</span>
    </button>
  );
}
