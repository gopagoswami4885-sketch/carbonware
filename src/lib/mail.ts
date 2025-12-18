export function buildMailto({to, subject = '', body = ''}: {to: string; subject?: string; body?: string}) {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  // encodeURIComponent does not escape '+' and spaces the same way URLSearchParams does for query strings,
  // but mailto expects percent-encoding; URLSearchParams is fine for this use-case.
  return `mailto:${encodeURIComponent(to)}?${params.toString()}`;
}
