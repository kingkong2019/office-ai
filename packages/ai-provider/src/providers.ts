import { getAiApiConfig, providerEndpoint } from './config'
import { loadAiApiConfig } from './config-node'
import {
  AI_PROVIDERS,
  BUILTIN_AI_PROVIDERS,
  GENSPARK_LLM_BASE_URLS,
  PROVIDER_BASE_URLS,
} from './providers-meta'
import type { AiProviderId, AiSettings, LegacyAiSettings } from './types'

export {
  AI_PROVIDERS,
  GENSPARK_AGENT_TYPE,
  GENSPARK_LLM_BASE_URLS,
  PROVIDER_BASE_URLS,
  gensparkAttributionHeaders,
} from './providers-meta'

/**
 * Apply endpoint / model overrides from the loaded ai-api.config.json onto the
 * mutable GENSPARK_LLM_BASE_URLS / PROVIDER_BASE_URLS / AI_PROVIDERS tables.
 * Safe to call repeatedly (e.g. after reload).
 */
export function applyAiApiConfigEndpoints(): void {
  const cfg = getAiApiConfig()

  // reset to builtins first so a reload that removes keys restores defaults
  GENSPARK_LLM_BASE_URLS.anthropic = 'https://www.genspark.ai/api/anthropic'
  GENSPARK_LLM_BASE_URLS.gemini = 'https://www.genspark.ai/api/llm_proxy/gemini/v1beta'
  GENSPARK_LLM_BASE_URLS.openai = 'https://www.genspark.ai/api/llm_proxy/v1'
  PROVIDER_BASE_URLS.anthropic = 'https://api.anthropic.com'
  PROVIDER_BASE_URLS.gemini = 'https://generativelanguage.googleapis.com/v1beta'
  PROVIDER_BASE_URLS.deepseek = 'https://api.deepseek.com/v1'
  PROVIDER_BASE_URLS.openai = 'https://api.openai.com/v1'

  for (let i = 0; i < AI_PROVIDERS.length; i++) {
    const builtin = BUILTIN_AI_PROVIDERS[i]!
    const live = AI_PROVIDERS[i]!
    live.label = builtin.label
    live.defaultModel = builtin.defaultModel
    live.models = [...builtin.models]
    live.keyPlaceholder = builtin.keyPlaceholder
    live.needsBaseUrl = builtin.needsBaseUrl
  }

  const gs = cfg.providers.genspark
  if (gs?.baseUrls) {
    if (gs.baseUrls.anthropic) GENSPARK_LLM_BASE_URLS.anthropic = gs.baseUrls.anthropic
    if (gs.baseUrls.gemini) GENSPARK_LLM_BASE_URLS.gemini = gs.baseUrls.gemini
    if (gs.baseUrls.openai) GENSPARK_LLM_BASE_URLS.openai = gs.baseUrls.openai
  }

  for (const id of ['anthropic', 'gemini', 'deepseek', 'openai', 'custom'] as const) {
    const baseUrl = cfg.providers[id]?.baseUrl
    if (baseUrl) PROVIDER_BASE_URLS[id] = baseUrl
  }

  for (const meta of AI_PROVIDERS) {
    const override = cfg.providers[meta.id]
    if (!override) continue
    if (override.label) meta.label = override.label
    if (override.defaultModel !== undefined) meta.defaultModel = override.defaultModel
    if (override.models) meta.models = [...override.models]
  }
}

/**
 * Fresh settings with every provider's default model and an empty key,
 * except providers listed in `defaultApiKeys` (e.g. an app-specific
 * preconfigured Anthropic key). Callers own that policy; this package
 * has no hardcoded keys. Values from ai-api.config.json win as defaults.
 */
export function defaultAiSettings(
  defaultApiKeys?: Partial<Record<AiProviderId, string>>,
): AiSettings {
  applyAiApiConfigEndpoints()
  const cfg = getAiApiConfig()
  const providers = {} as AiSettings['providers']
  for (const meta of AI_PROVIDERS) {
    const override = providerEndpoint(meta.id)
    const apiKey = override?.apiKey ?? defaultApiKeys?.[meta.id] ?? ''
    const model = override?.defaultModel ?? meta.defaultModel
    let baseUrl: string | undefined
    if (meta.needsBaseUrl || meta.id === 'custom') {
      baseUrl = override?.baseUrl ?? PROVIDER_BASE_URLS.custom ?? ''
    } else if (override?.baseUrl) {
      // surface configured base URL in settings for non-custom providers too
      baseUrl = override.baseUrl
    }
    providers[meta.id] = {
      apiKey,
      model,
      ...(baseUrl !== undefined ? { baseUrl } : {}),
    }
  }
  return { provider: cfg.defaultProvider, providers }
}

/**
 * Merge on-disk settings over freshly computed defaults, migrating the
 * pre-provider shape (a single OpenAI-compatible endpoint) into the
 * "custom" provider slot. `stored` is whatever the caller read from its
 * settings file (already JSON-parsed); this function does no file I/O.
 */
export function resolveAiSettings(
  stored: Partial<AiSettings> & LegacyAiSettings,
  defaults: AiSettings,
): AiSettings {
  if (!stored.providers) {
    if (stored.apiKey) {
      defaults.providers.custom = {
        apiKey: stored.apiKey,
        model: stored.model ?? '',
        baseUrl: stored.baseUrl ?? 'https://api.openai.com/v1',
      }
    }
    return defaults
  }
  const providers = { ...defaults.providers }
  for (const [id, override] of Object.entries(stored.providers) as [
    AiProviderId,
    AiSettings['providers'][AiProviderId],
  ][]) {
    const base = providers[id] ?? { apiKey: '', model: '' }
    providers[id] = {
      ...base,
      ...override,
      // Keep config/default secrets when the settings file has an empty key
      apiKey: override.apiKey?.trim() ? override.apiKey : base.apiKey,
      model: override.model?.trim() ? override.model : base.model,
      baseUrl: override.baseUrl?.trim() ? override.baseUrl : base.baseUrl,
    }
  }
  return {
    provider: stored.provider ?? defaults.provider,
    providers,
  }
}

/**
 * App-facing settings load: pick up ai-api.config.json (env / userData / cwd),
 * merge with persisted ai-settings.json, and only force provider=genspark when
 * no config opted into another default.
 */
export function loadResolvedAiSettings(
  stored: Partial<AiSettings> & LegacyAiSettings,
  options?: {
    userDataDir?: string
    searchRoots?: string[]
    defaultApiKeys?: Partial<Record<AiProviderId, string>>
  },
): AiSettings {
  loadAiApiConfig({ userDataDir: options?.userDataDir, searchRoots: options?.searchRoots })
  const cfg = getAiApiConfig()
  const settings = resolveAiSettings(stored, defaultAiSettings(options?.defaultApiKeys))
  if (!cfg.allowNonGensparkProvider) {
    // Product default: AI features go through Genspark (gsk login)
    settings.provider = 'genspark'
  } else if (
    cfg.defaultProvider !== 'genspark' &&
    (!stored.provider || stored.provider === 'genspark')
  ) {
    // Config opted into a non-Genspark default; don't keep a stale genspark preference
    settings.provider = cfg.defaultProvider
  }
  return settings
}

/** Base URL used for a direct (non-genspark) provider call. */
export function resolveProviderBaseUrl(
  provider: AiProviderId,
  configBaseUrl?: string,
): string | undefined {
  if (configBaseUrl?.trim()) return configBaseUrl.trim()
  applyAiApiConfigEndpoints()
  if (provider === 'genspark') return undefined
  return PROVIDER_BASE_URLS[provider]
}
