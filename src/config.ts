// API configuration
// Prefer an explicit VITE_API_URL, then try likely Render hosts used for this project.
const configuredUrls = [
	import.meta.env.VITE_API_URL,
	...(import.meta.env.VITE_API_URLS?.split(',') ?? []),
].map(url => url?.trim()).filter((url): url is string => Boolean(url))

export const API_URL_CANDIDATES = configuredUrls.length > 0
	? configuredUrls
	: [
			'https://vault-finance-api.onrender.com',
			'https://vault-finance.onrender.com',
		]

const healthCheckTimeoutMs = 2500
let resolvedApiUrlPromise: Promise<string> | null = null

async function isHealthy(url: string): Promise<boolean> {
	const controller = new AbortController()
	const timeoutId = window.setTimeout(() => controller.abort(), healthCheckTimeoutMs)

	try {
		const response = await fetch(`${url.replace(/\/$/, '')}/health`, {
			method: 'GET',
			cache: 'no-store',
			signal: controller.signal,
		})
		return response.ok
	} catch {
		return false
	} finally {
		window.clearTimeout(timeoutId)
	}
}

export function resolveApiBaseUrl(): Promise<string> {
	if (!resolvedApiUrlPromise) {
		resolvedApiUrlPromise = (async () => {
			for (const candidate of API_URL_CANDIDATES) {
				if (await isHealthy(candidate)) {
					return candidate.replace(/\/$/, '')
				}
			}

			return API_URL_CANDIDATES[0]!.replace(/\/$/, '')
		})()
	}

	return resolvedApiUrlPromise
}
