export function formatPrincipal(principal: string): string {
  if (principal.length <= 10) return principal;
  return `${principal.slice(0, 5)}...${principal.slice(-5)}`;
}
