export function removeApiSegment(url: string): string {
  return url.replace(/\/api\/?$/, '/');
}
