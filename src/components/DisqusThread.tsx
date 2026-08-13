import React, { useEffect } from 'react';
import { MessageSquare } from 'lucide-react';

interface DisqusThreadProps {
  identifier?: string;
  title?: string;
  url?: string;
}

export const DisqusThread: React.FC<DisqusThreadProps> = ({
  identifier = 'propintel-sg-forum',
  title = 'PropIntel SG Discussion Forum',
  url,
}) => {
  useEffect(() => {
    const pageUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

    // Configure disqus_config
    (window as any).disqus_config = function (this: any) {
      this.page.url = pageUrl;
      this.page.identifier = identifier;
      this.page.title = title;
    };

    // Load embed.js or reset DISQUS if already loaded
    if ((window as any).DISQUS) {
      (window as any).DISQUS.reset({
        reload: true,
        config: (window as any).disqus_config,
      });
    } else {
      const d = document;
      const existingScript = d.querySelector('script[src="https://aiagentdemo.disqus.com/embed.js"]');
      if (!existingScript) {
        const s = d.createElement('script');
        s.src = 'https://aiagentdemo.disqus.com/embed.js';
        s.setAttribute('data-timestamp', (+new Date()).toString());
        (d.head || d.body).appendChild(s);
      }
    }

    // Load count.js script for Disqus comment counts
    const existingCountScript = document.getElementById('dsq-count-scr');
    if (!existingCountScript) {
      const s = document.createElement('script');
      s.id = 'dsq-count-scr';
      s.src = '//aiagentdemo.disqus.com/count.js';
      s.async = true;
      (document.head || document.body).appendChild(s);
    }
  }, [identifier, title, url]);

  return (
    <div className="w-full bg-slate-800/40 border border-slate-800 rounded-2xl p-5 shadow-sm text-slate-100">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Community Discussion Forum</h3>
            <p className="text-xs text-slate-400">
              Share property insights, ask questions, and engage with analysts.
            </p>
          </div>
        </div>
        <a
          href="#disqus_thread"
          data-disqus-identifier={identifier}
          className="text-xs font-semibold text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors"
        >
          Comment Count
        </a>
      </div>

      {/* Disqus Container */}
      <div id="disqus_thread" className="min-h-[250px]" />

      <noscript>
        Please enable JavaScript to view the{' '}
        <a href="https://disqus.com/?ref_noscript" className="text-indigo-400 underline">
          comments powered by Disqus.
        </a>
      </noscript>
    </div>
  );
};
