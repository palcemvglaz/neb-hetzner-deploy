export function getAvailableProviders() {
  const providers = ['credentials'] // Always available
  
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push('google')
  }
  
  if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
    providers.push('github')
  }
  
  return providers
}

export function isProviderAvailable(provider: string): boolean {
  return getAvailableProviders().includes(provider)
}