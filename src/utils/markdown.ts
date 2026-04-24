export function renderMarkdown(md: string): string {
  let html = md
    // Escape HTML entities first
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Tables
  html = html.replace(/\n(\|.+\|)\n(\|[-| :]+\|)\n((?:\|.+\|\n?)+)/g, (_m, header, _sep, body) => {
    const headers = header.split('|').filter((c: string) => c.trim()).map((c: string) =>
      `<th class="px-4 py-2 text-left text-cyan-accent font-semibold text-sm">${c.trim()}</th>`
    ).join('');
    const rows = body.trim().split('\n').map((row: string) => {
      const cells = row.split('|').filter((c: string) => c.trim()).map((c: string) =>
        `<td class="px-4 py-2 text-slate-300 text-sm border-t border-bg-border">${c.trim()}</td>`
      ).join('');
      return `<tr class="hover:bg-bg-elevated/40 transition-colors">${cells}</tr>`;
    }).join('');
    return `\n<div class="overflow-x-auto my-6 rounded-xl border border-bg-border"><table class="w-full"><thead><tr class="bg-bg-elevated">${headers}</tr></thead><tbody>${rows}</tbody></table></div>\n`;
  });

  // Headings
  html = html
    .replace(/^#### (.+)$/gm, '<h4 class="text-base font-semibold text-white mt-5 mb-2">$1</h4>')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-white mt-7 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-display font-bold text-white mt-10 mb-4 pb-2 border-b border-bg-border">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-display font-bold text-white mt-8 mb-4">$1</h1>');

  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-4 border-cyan-accent bg-bg-elevated rounded-r-xl px-5 py-3 my-4 text-slate-300 italic">$1</blockquote>');

  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr class="border-bg-border my-8" />');

  // Bold and italic
  html = html
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong class="font-bold text-white"><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-slate-200">$1</em>')
    .replace(/__(.+?)__/g, '<strong class="font-semibold text-white">$1</strong>')
    .replace(/_(.+?)_/g, '<em class="text-slate-200">$1</em>');

  // Inline code
  html = html.replace(/`(.+?)`/g, '<code class="bg-bg-elevated text-cyan-accent px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-cyan-accent hover:text-white underline underline-offset-2 transition-colors">$1</a>');

  // Unordered lists
  html = html.replace(/((?:^[-*+] .+\n?)+)/gm, (match) => {
    const items = match.trim().split('\n').map(line =>
      `<li class="flex gap-2 text-slate-300"><span class="text-cyan-accent mt-1.5 shrink-0">▸</span><span>${line.replace(/^[-*+] /, '')}</span></li>`
    ).join('');
    return `<ul class="my-4 space-y-2">${items}</ul>`;
  });

  // Ordered lists
  html = html.replace(/((?:^\d+\. .+\n?)+)/gm, (match) => {
    let i = 0;
    const items = match.trim().split('\n').map(line => {
      i++;
      return `<li class="flex gap-3 text-slate-300"><span class="text-cyan-accent font-bold shrink-0 min-w-[1.5rem]">${i}.</span><span>${line.replace(/^\d+\. /, '')}</span></li>`;
    }).join('');
    return `<ol class="my-4 space-y-2">${items}</ol>`;
  });

  // Paragraphs — double newlines
  html = html
    .split(/\n{2,}/)
    .map(block => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      // Don't wrap block-level elements
      if (/^<(h[1-6]|ul|ol|blockquote|div|hr|table)/.test(trimmed)) return trimmed;
      return `<p class="text-slate-300 leading-relaxed mb-4">${trimmed.replace(/\n/g, ' ')}</p>`;
    })
    .join('\n');

  return html;
}

export function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
