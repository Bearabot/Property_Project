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
      s.src = 'https://aiagentdemo.disqus.com/count.js';
      s.async = true;
      (document.head || document.body).appendChild(s);
    }
  }, [identifier, title, url]);

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-slate-800/80 gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Community Discussion Forum</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Share Singapore property insights, ask questions, and engage with market analysts.
            </p>
          </div>
        </div>
        <a
          href="#disqus_thread"
          data-disqus-identifier={identifier}
          className="self-start sm:self-auto text-xs font-semibold text-indigo-300 bg-indigo-500/20 px-4 py-2 rounded-full border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors shadow-sm"
        >
          Comment Count
        </a>
      </div>

      {/* Disqus Container */}
      <div id="disqus_thread" className="min-h-[280px]" />

      <noscript>
        Please enable JavaScript to view the{' '}
        <a href="https://disqus.com/?ref_noscript" className="text-indigo-400 underline">
          comments powered by Disqus.
        </a>
      </noscript>
    </div>
  );
};
