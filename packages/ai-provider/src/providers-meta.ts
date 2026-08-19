import type { GensparkBaseUrlsConfig } from './config'
import type { AiProviderId, AiProviderMeta } from './types'

/**
 * Genspark server-side LLM proxy endpoints. All three protocols share the
 * api_key from the gsk login; model ids follow the proxy's own naming scheme,
 * which differs from the official vendor ids.
 *
 * Values are mutable so `loadAiApiConfig()` / `applyAiApiConfigEndpoints()` can
 * override them from ai-api.config.json without rebuilding.
 */
export const GENSPARK_LLM_BASE_URLS: Required<GensparkBaseUrlsConfig> = {
  anthropic: 'https://www.genspark.ai/api/anthropic',
  gemini: 'https://www.genspark.ai/api/llm_proxy/gemini/v1beta',
  openai: 'https://www.genspark.ai/api/llm_proxy/v1',
}

/** Direct vendor / OpenAI-compatible roots (overridable via config). */
export const PROVIDER_BASE_URLS: Partial<Record<AiProviderId, string>> = {
  anthropic: 'https://api.anthropic.com',
  gemini: 'https://generativelanguage.googleapis.com/v1beta',
  deepseek: 'https://api.deepseek.com/v1',
  openai: 'https://api.openai.com/v1',
}

/**
 * Splits GenOffice usage out of the proxy's default "Claw" billing bucket
 * (the backend attributes gsk-key traffic by X-Agent-Type). Only sent to the
 * Genspark proxy — never to direct vendor APIs.
 */
export const GENSPARK_AGENT_TYPE = 'genoffice'

export function gensparkAttributionHeaders(baseUrl?: string): Record<string, string> {
  return baseUrl?.startsWith('https://www.genspark.ai')
    ? { 'X-Agent-Type': GENSPARK_AGENT_TYPE }
    : {}
}

export const BUILTIN_AI_PROVIDERS: AiProviderMeta[] = [
  {
    id: 'genspark',
    label: 'Genspark',
    models: [
      'claude-opus-4-7',
      'claude-opus-4-8',
      'claude-sonnet-4-6',
      'claude-haiku-4-5',
      'gpt-5.2',
      'gemini-3.1-pro-preview',
      'gemini-3-flash-preview',
    ],
    defaultModel: 'claude-opus-4-7',
    keyPlaceholder: 'Not required - sign in to Genspark',
  },
  {
    id: 'anthropic',
    label: 'Claude',
    models: [
      'claude-sonnet-5',
      'claude-opus-4-8',
      'claude-opus-4-7',
      'claude-sonnet-4-6',
      'claude-opus-4-6',
      'claude-opus-4-5-20251101',
      'claude-haiku-4-5-20251001',
      'claude-sonnet-4-5-20250929',
    ],
    defaultModel: 'claude-opus-4-7',
    keyPlaceholder: 'sk-ant-api03-...',
  },
  {
    id: 'gemini',
    label: 'Gemini',
    models: ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.0-flash'],
    defaultModel: 'gemini-2.5-flash',
    keyPlaceholder: 'AIza...',
  },
  {
    id: 'deepseek',
    label: 'DeepSeek',
    models: ['deepseek-chat', 'deepseek-reasoner'],
    defaultModel: 'deepseek-chat',
    keyPlaceholder: 'sk-...',
  },
  {
    id: 'openai',
    label: 'OpenAI',
    models: ['gpt-4.1', 'gpt-4.1-mini', 'gpt-4o', 'gpt-4o-mini'],
    defaultModel: 'gpt-4.1-mini',
    keyPlaceholder: 'sk-...',
  },
  {
    id: 'custom',
    label: 'Custom',
    models: [],
    defaultModel: '',
    keyPlaceholder: 'API Key',
    needsBaseUrl: true,
  },
]

/** Live provider metadata (patched in place when a config file is loaded). */
export const AI_PROVIDERS: AiProviderMeta[] = BUILTIN_AI_PROVIDERS.map((p) => ({
  ...p,
  models: [...p.models],
}))
