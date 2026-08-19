import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  AI_API_CONFIG_ENV,
  getAiApiConfig,
  parseAiApiConfig,
  resetAiApiConfigForTests,
  setAiApiConfigForTests,
} from '../src/config'
import { loadAiApiConfig } from '../src/config-node'
import {
  AI_PROVIDERS,
  GENSPARK_LLM_BASE_URLS,
  PROVIDER_BASE_URLS,
} from '../src/providers-meta'
import {
  applyAiApiConfigEndpoints,
  defaultAiSettings,
  loadResolvedAiSettings,
} from '../src/providers'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

describe('parseAiApiConfig', () => {
  it('accepts a full custom-provider config', () => {
    const parsed = parseAiApiConfig({
      defaultProvider: 'custom',
      providers: {
        custom: {
          baseUrl: 'http://127.0.0.1:8000/v1',
          apiKey: 'sk-test',
          defaultModel: 'demo',
          models: ['demo'],
        },
      },
    })
    expect(parsed.defaultProvider).toBe('custom')
    expect(parsed.providers?.custom?.baseUrl).toBe('http://127.0.0.1:8000/v1')
    expect(parsed.providers?.custom?.models).toEqual(['demo'])
  })

  it('ignores unknown provider ids and bad shapes', () => {
    const parsed = parseAiApiConfig({
      defaultProvider: 'not-a-provider',
      providers: { nope: { baseUrl: 'x' }, openai: { baseUrl: 123 } },
    })
    expect(parsed.defaultProvider).toBeUndefined()
    expect(parsed.providers).toBeUndefined()
  })
})

describe('config-driven defaults', () => {
  beforeEach(() => {
    resetAiApiConfigForTests()
  })
  afterEach(() => {
    resetAiApiConfigForTests()
    delete process.env[AI_API_CONFIG_ENV]
  })

  it('defaultAiSettings uses configured provider, key, model and baseUrl', () => {
    setAiApiConfigForTests({
      defaultProvider: 'custom',
      providers: {
        custom: {
          baseUrl: 'https://llm.example/v1',
          apiKey: 'sk-from-file',
          defaultModel: 'file-model',
          models: ['file-model', 'other'],
        },
      },
    })
    applyAiApiConfigEndpoints()
    const settings = defaultAiSettings()
    expect(settings.provider).toBe('custom')
    expect(settings.providers.custom).toEqual({
      apiKey: 'sk-from-file',
      model: 'file-model',
      baseUrl: 'https://llm.example/v1',
    })
    expect(AI_PROVIDERS.find((p) => p.id === 'custom')?.models).toEqual(['file-model', 'other'])
  })

  it('overrides genspark and openai endpoint tables', () => {
    setAiApiConfigForTests({
      providers: {
        genspark: {
          baseUrls: {
            openai: 'https://proxy.example/v1',
            anthropic: 'https://proxy.example/anthropic',
          },
        },
        openai: { baseUrl: 'https://my-openai.example/v1' },
      },
    })
    applyAiApiConfigEndpoints()
    expect(GENSPARK_LLM_BASE_URLS.openai).toBe('https://proxy.example/v1')
    expect(GENSPARK_LLM_BASE_URLS.anthropic).toBe('https://proxy.example/anthropic')
    expect(PROVIDER_BASE_URLS.openai).toBe('https://my-openai.example/v1')
  })

  it('loadResolvedAiSettings stops forcing genspark when config opts out', () => {
    setAiApiConfigForTests({
      defaultProvider: 'openai',
      allowNonGensparkProvider: true,
      providers: {
        openai: { apiKey: 'sk-oai', defaultModel: 'gpt-4.1-mini' },
      },
    })
    const settings = loadResolvedAiSettings({})
    expect(settings.provider).toBe('openai')
    expect(settings.providers.openai.apiKey).toBe('sk-oai')
  })

  it('loadResolvedAiSettings prefers config default over stale genspark stored provider', () => {
    setAiApiConfigForTests({
      defaultProvider: 'custom',
      allowNonGensparkProvider: true,
      providers: {
        custom: {
          baseUrl: 'https://llm.example/v1',
          apiKey: 'sk-from-file',
          defaultModel: 'file-model',
        },
      },
    })
    const settings = loadResolvedAiSettings({
      provider: 'genspark',
      providers: {
        genspark: { apiKey: '', model: 'claude-opus-4-7' },
        custom: { apiKey: '', model: '' },
      } as never,
    })
    expect(settings.provider).toBe('custom')
    expect(settings.providers.custom.apiKey).toBe('sk-from-file')
    expect(settings.providers.custom.model).toBe('file-model')
  })

  it('loadResolvedAiSettings still forces genspark with no config', () => {
    setAiApiConfigForTests(null)
    const settings = loadResolvedAiSettings({
      provider: 'openai',
      providers: {
        openai: { apiKey: 'x', model: 'gpt-4.1-mini' },
      } as never,
    })
    expect(settings.provider).toBe('genspark')
  })

  it('loads from GENOFFICE_AI_CONFIG path', () => {
    const dir = mkdtempSync(join(tmpdir(), 'genoffice-ai-cfg-'))
    const file = join(dir, 'ai-api.config.json')
    writeFileSync(
      file,
      JSON.stringify({
        defaultProvider: 'deepseek',
        allowNonGensparkProvider: true,
        providers: { deepseek: { baseUrl: 'https://ds.example/v1', apiKey: 'sk-ds' } },
      }),
    )
    process.env[AI_API_CONFIG_ENV] = file
    const cfg = loadAiApiConfig({ reload: true })
    expect(cfg.path).toBe(file)
    expect(cfg.defaultProvider).toBe('deepseek')
    expect(getAiApiConfig().providers.deepseek?.baseUrl).toBe('https://ds.example/v1')
    rmSync(dir, { recursive: true, force: true })
  })
})
