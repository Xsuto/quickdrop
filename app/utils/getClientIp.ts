export function getClientIp(request: Request): string {
  // Try Cloudflare-specific headers first
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  if (cfConnectingIp) return cfConnectingIp

  // Try various forwarded headers
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    // Get the first IP in the chain
    const ips = forwardedFor.split(',').map(ip => ip.trim())
    return ips[0]
  }

  // Try real-ip header
  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp

  return 'unknown'
} 