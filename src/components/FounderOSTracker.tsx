'use client';
import { useEffect } from 'react';

interface FounderOSTrackerProps {
  siteId: string;
}

export default function FounderOSTracker({ siteId }: FounderOSTrackerProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    try {
      fetch('https://founderos-dashboard.vercel.app/api/track', {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'pageview',
          landing: siteId,
          data: {
            page_url: window.location.pathname,
            page_title: document.title,
            utm_source: params.get('utm_source') || 'direct',
            utm_medium: params.get('utm_medium') || '',
            utm_campaign: params.get('utm_campaign') || '',
            ref: document.referrer || '',
          },
        }),
      }).catch(() => {});
    } catch (e) {}

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a, button, .cta');
      if (!target) return;
      const href = (target as HTMLAnchorElement).href || '';
      const text = (target.textContent || '').slice(0, 100);
      if (!href && !target.classList.contains('cta')) return;
      try {
        fetch('https://founderos-dashboard.vercel.app/api/track', {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'cta_click',
            landing: siteId,
            data: { target: href, text },
          }),
        }).catch(() => {});
      } catch (e2) {}
    };
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [siteId]);

  return null;
}
