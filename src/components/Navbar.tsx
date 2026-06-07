import Link from 'next/link';
import { useRouter } from 'next/router';
import { Zap, LayoutDashboard, History, BookOpen, Github } from 'lucide-react';
import clsx from 'clsx';

const NAV = [
  { href: '/',        label: 'Review',    icon: Zap },
  { href: '/history', label: 'History',   icon: History },
  { href: '/learn',   label: 'Learn',     icon: BookOpen },
];

export default function Navbar() {
  const { pathname } = useRouter();
  return (
    <nav className="fixed top-0 inset-x-0 z-50 glass-1 border-b border-line/60">
      <div className="max-w-screen-xl mx-auto px-5 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-md bg-cyan/10 border border-cyan/30 flex items-center justify-center group-hover:border-cyan/60 transition-all animate-pulse-cyan">
            <Zap size={14} className="text-cyan" fill="currentColor" />
          </div>
          <span className="font-display font-semibold text-base tracking-tight">
            Code<span className="text-cyan text-glow-cyan">Sense</span>
            <span className="text-dim font-light"> AI</span>
          </span>
        </Link>

        {/* Nav */}
        <div className="flex items-center gap-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-200',
                active ? 'bg-cyan/10 text-cyan border border-cyan/20' : 'text-dim hover:text-text hover:bg-raised'
              )}>
                <Icon size={13} />
                {label}
              </Link>
            );
          })}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-dim hover:text-text border border-line hover:border-line/80 transition-all"
          >
            <Github size={13} />
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
