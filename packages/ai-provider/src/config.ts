/**
 * In-memory AI API config (ai-api.config.json shape).
 *
 * Parsing / cache live here so renderer code can import provider metadata
 * without pulling Node `fs`/`path`. Disk loading is in `config-node.ts`
 * (main process / Node only).
 */
import type { AiProviderId } from './types'

export const AI_API_CONFIG_FILENAME = 'ai-api.config.json'
export const AI_API_CONFIG_ENV = 'GENOFFICE_AI_CONFIG'

/** Per-protocol endpoints used by the Genspark proxy (and any compatible fork). */
export interface GensparkBaseUrlsConfig {
  anthropic?: string
  gemini?: string
  openai?: string
}

export interface AiProviderEndpointConfig {
  /** Display label override in the settings UI */
  label?: string
  /** OpenAI-compatible / Anthropic / Gemini root URL (no trailing slash required) */
  baseUrl?: string
  /** Genspark-style multi-protocol proxy roots */
  baseUrls?: GensparkBaseUrlsConfig
  /** Prefill API key (prefer env/secrets in production; this is for local/dev) */
  apiKey?: string
  /** Default model id for this provider */
  defaultModel?: string
  /** Model picker list; when set, replaces the built-in list */
  models?: string[]
}

export interface AiApiConfigFile {
  /** Active provider when no ai-settings.json preference exists */
  defaultProvider?: AiProviderId
  /**
   * When true (default if defaultProvider is set), ai:get-settings will not
   * force the provider back to genspark.
   */
  allowNonGensparkProvider?: boolean
  providers?: Partial<Record<AiProviderId, AiProviderEndpointConfig>>
}

export interface ResolvedAiApiConfig {
  /** Absolute path of the file that was loaded, or null when using builtins */
  path: string | null
  defaultProvider: AiProviderId
  /** Whether apps should stop forcing provider=genspark */
  allowNonGensparkProvider: boolean
  providers: Partial<Record<AiProviderId, AiProviderEndpointConfig>>
}

export const BUILTIN_AI_API_CONFIG: ResolvedAiApiConfig = {
  path: null,
  defaultProvider: 'genspark',
  allowNonGensparkProvider: false,
  providers: {},
}

let cached: ResolvedAiApiConfig = { ...BUILTIN_AI_API_CONFIG, providers: {} }
/** undefined = never loaded; null = loaded builtins; string = file / test id */
let loadedFrom: string | null | undefined

function isProviderId(value: unknown): value is AiProviderId {
  return (
    value === 'genspark' ||
    value === 'anthropic' ||
    value === 'gemini' ||
    value === 'deepseek' ||
    value === 'openai' ||
    value === 'custom'
  )
}

function normalizeProviderEntry(raw: unknown): AiProviderEndpointConfig | undefined {
  if (!raw || typeof raw !== 'object') return undefined
  const o = raw as Record<string, unknown>
  const entry: AiProviderEndpointConfig = {}
  if (typeof o.label === 'string') entry.label = o.label
  if (typeof o.baseUrl === 'string') entry.baseUrl = o.baseUrl.trim()
  if (typeof o.apiKey === 'string') entry.apiKey = o.apiKey
  if (typeof o.defaultModel === 'string') entry.defaultModel = o.defaultModel
  if (Array.isArray(o.models) && o.models.every((m) => typeof m === 'string')) {
    entry.models = o.models as string[]
  }
  if (o.baseUrls && typeof o.baseUrls === 'object') {
    const bu = o.baseUrls as Record<string, unknown>
    const baseUrls: GensparkBaseUrlsConfig = {}
    if (typeof bu.anthropic === 'string') baseUrls.anthropic = bu.anthropic.trim()
    if (typeof bu.gemini === 'string') baseUrls.gemini = bu.gemini.trim()
    if (typeof bu.openai === 'string') baseUrls.openai = bu.openai.trim()
    if (Object.keys(baseUrls).length > 0) entry.baseUrls = baseUrls
  }
  return Object.keys(entry).length > 0 ? entry : undefined
}

export function parseAiApiConfig(raw: unknown): AiApiConfigFile {
  if (!raw || typeof raw !== 'object') return {}
  const o = raw as Record<string, unknown>
  const out: AiApiConfigFile = {}
  if (isProviderId(o.defaultProvider)) out.defaultProvider = o.defaultProvider
  if (typeof o.allowNonGensparkProvider === 'boolean') {
    out.allowNonGensparkProvider = o.allowNonGensparkProvider
  }
  if (o.providers && typeof o.providers === 'object') {
    const providers: AiApiConfigFile['providers'] = {}
    for (const [key, value] of Object.entries(o.providers as Record<string, unknown>)) {
      if (!isProviderId(key)) continue
      const entry = normalizeProviderEntry(value)
      if (entry) providers[key] = entry
    }
    if (Object.keys(providers).length > 0) out.providers = providers
  }
  return out
}

export function toResolvedAiApiConfig(
  file: AiApiConfigFile,
  path: string | null,
): ResolvedAiApiConfig {
  const defaultProvider = file.defaultProvider ?? 'genspark'
  const allowNonGensparkProvider =
    file.allowNonGensparkProvider ??
    (file.defaultProvider !== undefined && file.defaultProvider !== 'genspark')
  return {
    path,
    defaultProvider,
    allowNonGensparkProvider,
    providers: file.providers ?? {},
  }
}

/** Current resolved config (builtins until main process loads a file). */
export function getAiApiConfig(): ResolvedAiApiConfig {
  if (loadedFrom === undefined) {
    cached = { ...BUILTIN_AI_API_CONFIG, providers: {} }
    loadedFrom = null
  }
  return cached
}

/** Used by config-node / tests to publish a resolved config into the cache. */
export function setResolvedAiApiConfig(config: ResolvedAiApiConfig, from: string | null): void {
  cached = config
  loadedFrom = from
}

export function getAiApiConfigLoadState(): string | null | undefined {
  return loadedFrom
}

/** Test helper: inject a config without touching the filesystem. */
export function setAiApiConfigForTests(config: AiApiConfigFile | null): void {
  if (config === null) {
    cached = { ...BUILTIN_AI_API_CONFIG, providers: {} }
    loadedFrom = null
    return
  }
  cached = toResolvedAiApiConfig(config, '<test>')
  loadedFrom = '<test>'
}

export function resetAiApiConfigForTests(): void {
  cached = { ...BUILTIN_AI_API_CONFIG, providers: {} }
  loadedFrom = undefined
}

export function providerEndpoint(id: AiProviderId): AiProviderEndpointConfig | undefined {
  return getAiApiConfig().providers[id]
}
