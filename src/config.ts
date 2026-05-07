// API configuration
// Keep the backend URL outside the repo and inject it during deployment.
const configuredUrls = [
	import.meta.env.VITE_API_URL,
	...(import.meta.env.VITE_API_URLS?.split(',') ?? []),
].map(url => url?.trim()).filter((url): url is string => Boolean(url))

export async function resolveApiBaseUrl(): Promise<string> {
	if (configuredUrls.length === 0) {
		throw new Error('VITE_API_URL is not set')
	}

	return configuredUrls[0]!.replace(/\/$/, '')
}
