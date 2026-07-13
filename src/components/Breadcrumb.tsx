import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useEffect } from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string; // omit for last (current) item
}

interface Props {
  items: BreadcrumbItem[];
}

/**
 * Renders a visual breadcrumb trail + injects BreadcrumbList Schema.org JSON-LD.
 *
 * Usage:
 *   <Breadcrumb items={[
 *     { label: 'Accueil', href: '/fr' },
 *     { label: 'Blog', href: '/fr/blog' },
 *     { label: 'Mon article' },           // no href = current page
 *   ]} />
 */
export default function Breadcrumb({ items }: Props) {
  const location = useLocation();

  // ── Schema.org BreadcrumbList ────────────────────────────────────────────────
  useEffect(() => {
    const base = window.location.origin;

    const listItems = items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: item.href ? base + item.href : base + location.pathname,
    }));

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: listItems,
    };

    const id = 'schema-breadcrumb';
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      (el as HTMLScriptElement).type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(schema);

    return () => {
      document.getElementById(id)?.remove();
    };
  }, [items, location.pathname]);

  if (items.length < 2) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-slate-400 flex-wrap">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />}
            {i === 0 && <Home className="w-3.5 h-3.5 flex-shrink-0" />}
            {isLast || !item.href ? (
              <span className={isLast ? 'text-slate-300 truncate max-w-[200px]' : ''} aria-current={isLast ? 'page' : undefined}>
                {item.label}
              </span>
            ) : (
              <Link to={item.href} className="hover:text-cyan-400 transition-colors truncate max-w-[160px]">
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
