export function firstPathSegment() {
  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  return pathSegments[0];
}
