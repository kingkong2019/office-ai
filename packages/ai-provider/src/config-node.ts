/**
 * Node-only loader for ai-api.config.json.
 *
 * Looked up in order:
 *   1. GENOFFICE_AI_CONFIG (absolute/relative path)
 *   2. <userData>/ai-api.config.json  (Electron userData, when provided)
 *   3. <searchRoot>/ai-api.config.json for each searchRoots entry
 *   4. <cwd>/ai-api.config.json       (dev / CLI)
 *
 * Missing file → built-in defaults (Genspark-first). Invalid JSON is ignored
 * with a console warning so a bad edit cannot brick the app.
 *
 * Keep this module out of renderer import graphs (it uses node:fs / node:path).
 */
import { existsSync, readFileSync } from 'node:fs'
import { isAbsolute, resolve } from 'node:path'
import {
  AI_API_CONFIG_ENV,
  AI_API_CONFIG_FILENAME,
  BUILTIN_AI_API_CONFIG,
  getAiApiConfig,
  getAiApiConfigLoadState,
  parseAiApiConfig,
  setResolvedAiApiConfig,
  toResolvedAiApiConfig,
  type AiApiConfigFile,
  type ResolvedAiApiConfig,
} from './config'

function resolveCandidatePaths(userDataDir?: string, searchRoots?: string[]): string[] {
  const paths: string[] = []
  const fromEnv = process.env[AI_API_CONFIG_ENV]?.trim()
  if (fromEnv) {
    paths.push(isAbsolute(fromEnv) ? fromEnv : resolve(process.cwd(), fromEnv))
  }
  if (userDataDir) {
    paths.push(resolve(userDataDir, AI_API_CONFIG_FILENAME))
  }
  for (const root of searchRoots ?? []) {
    if (root?.trim()) paths.push(resolve(root, AI_API_CONFIG_FILENAME))
  }
  paths.push(resolve(process.cwd(), AI_API_CONFIG_FILENAME))
  return paths
}

function readConfigFile(path: string): AiApiConfigFile | null {
  try {
    const text = readFileSync(path, 'utf-8')
    return parseAiApiConfig(JSON.parse(text) as unknown)
  } catch (err) {
    console.warn(`[ai-provider] failed to load ${path}:`, err)
    return null
  }
}

/**
 * Load (or reload) the AI API config. Pass Electron `app.getPath('userData')`
 * so packaged installs pick up `<userData>/ai-api.config.json`. In monorepo
 * `npm run dev`, also pass the repo root via `searchRoots` — Electron's cwd is
 * often `apps/shell`, which would miss the root `ai-api.config.json`.
 */
export function loadAiApiConfig(options?: {
  userDataDir?: string
  /** Extra directories to check for ai-api.config.json (e.g. monorepo root) */
  searchRoots?: string[]
  /** Force re-read even if already loaded */
  reload?: boolean
}): ResolvedAiApiConfig {
  const loadedFrom = getAiApiConfigLoadState()
  // Keep a successful load; retry when the previous pass found nothing but new
  // search locations (userData / searchRoots) are now available.
  if (loadedFrom !== undefined && !options?.reload) {
    if (loadedFrom !== null) return getAiApiConfig()
    if (!options?.userDataDir && !(options?.searchRoots && options.searchRoots.length > 0)) {
      return getAiApiConfig()
    }
  }

  for (const candidate of resolveCandidatePaths(options?.userDataDir, options?.searchRoots)) {
    if (!existsSync(candidate)) continue
    const parsed = readConfigFile(candidate)
    if (!parsed) continue
    const resolved = toResolvedAiApiConfig(parsed, candidate)
    setResolvedAiApiConfig(resolved, candidate)
    return resolved
  }

  setResolvedAiApiConfig({ ...BUILTIN_AI_API_CONFIG, providers: {} }, null)
  return getAiApiConfig()
}
