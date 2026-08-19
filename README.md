# Office AI

**AI-native office suite** — a public fork of [GenOffice](https://github.com/genspark-ai/genoffice)
with bring-your-own LLM config and offline-friendly slide page generation.

[English](./README.md) · [中文](./README.zh-CN.md)

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Upstream GenOffice](https://img.shields.io/github/v/release/genspark-ai/genoffice?label=upstream)](https://github.com/genspark-ai/genoffice/releases/latest)

**Repo:** [kingkong2019/office-ai](https://github.com/kingkong2019/office-ai)  
**Upstream:** [genspark-ai/genoffice](https://github.com/genspark-ai/genoffice) · [genoffice.ai](https://genoffice.ai/) · [Demo](https://www.youtube.com/watch?v=B2pLdMX95v4)

Office AI keeps the GenOffice engine stack (Docs / Sheets / Slides / PDF / Markdown
in one Electron shell) and adds:

- **Custom AI providers** via `ai-api.config.json` (OpenAI-compatible, Anthropic, custom — no Genspark login required for chat)
- **Local slide page generation** when cloud `slide_generate` is unavailable

Internal npm package names remain `@genoffice/*` for easier upstream sync. The
**product display name**, installers, GitHub links, and default folders use **Office AI**.

## Features

- **Real PDF editing** — retype text and edit images in the page itself, original fonts preserved.
- **Microsoft Word–compatible, byte-preserving `.docx` editing** — only what you touched changes.
- **Word-faithful pagination** — page breaks land where Word puts them.
- **Excel-compatible spreadsheets** — in-house engine with a Rust `.xlsx` sidecar, charts, pivot tables, slicers.
- **PowerPoint-compatible presentations** — in-house `.pptx` engine with masters, layouts, smart guides.
- **Markdown to Word, fully local** — same OOXML engine, no Pandoc, no cloud.
- **AI that edits documents** — block-level edits with snapshots and diffs.
- **Bring your own LLM** — configure endpoints in `ai-api.config.json`.
- **Local slide page generation** — `generate_deck` works without Genspark cloud layout.
- **Agent tools** — web/image search, image generation, media analysis (Genspark account when using those tools).
- **Light / dark / system themes.**
- **macOS, Windows, Linux.**
- **Free & open-source (Apache-2.0).**

## Download

Prebuilt installers are published by **upstream GenOffice** today. Build from this
repo with `npm run dist:mac` / `dist:win` / `dist:linux` to produce **Office AI**
artifacts (`OfficeAI-*.dmg` / `.exe` / `.AppImage`, `office-ai_*.deb` / `.rpm`).

Upstream binaries (still branded GenOffice):

| Platform | Download |
| -------- | -------- |
| **macOS** arm64 | [GenOffice-0.6.389-arm64.dmg](https://github.com/genspark-ai/genoffice/releases/download/v0.6.389/GenOffice-0.6.389-arm64.dmg) |
| **macOS** x64 | [GenOffice-0.6.389.dmg](https://github.com/genspark-ai/genoffice/releases/download/v0.6.389/GenOffice-0.6.389.dmg) |
| **Windows** x64 | [GenOfficeSetup-v0.6.389.exe](https://github.com/genspark-ai/genoffice/releases/download/v0.6.389/GenOfficeSetup-v0.6.389.exe) |
| **Linux** deb | [genoffice_0.6.389_amd64.deb](https://github.com/genspark-ai/genoffice/releases/download/v0.6.389/genoffice_0.6.389_amd64.deb) |
| **Linux** rpm | [genoffice-0.6.389.x86_64.rpm](https://github.com/genspark-ai/genoffice/releases/download/v0.6.389/genoffice-0.6.389.x86_64.rpm) |
| **Linux** AppImage | [GenOffice-0.6.389.AppImage](https://github.com/genspark-ai/genoffice/releases/download/v0.6.389/GenOffice-0.6.389.AppImage) |

## Apps

| App | Product | What it is |
| --- | ------- | ---------- |
| `apps/docs` | **Office AI Docs** | `.docx` word processor with byte-preserving round trip. |
| `apps/sheets` | **Office AI Sheets** | `.xlsx` spreadsheet (Univer UI + Rust sidecar). |
| `apps/slides` | **Office AI Slides** | `.pptx` presentations. |
| `apps/pdf` | **Office AI PDF** | True PDF text/image editing. |
| `apps/markdown` | **Office AI Markdown** | Markdown editor in shell tabs. |
| `apps/shell` | **Office AI** | Suite shell: home, tabs, theme, updates. |

**AI backend.** Two modes:

1. **Genspark (upstream default)** — device-code sign-in; models and gsk tools via Genspark.
2. **Custom providers (this fork)** — `ai-api.config.json` with `defaultProvider` / `allowNonGensparkProvider`. See below.

## Custom AI API config

```bash
cp ai-api.config.example.json ai-api.config.json
```

```json
{
  "defaultProvider": "custom",
  "allowNonGensparkProvider": true,
  "providers": {
    "custom": {
      "label": "My LLM",
      "baseUrl": "http://127.0.0.1:8000/v1",
      "apiKey": "sk-your-key",
      "defaultModel": "my-model",
      "models": ["my-model", "my-model-fast"]
    }
  }
}
```

**Load order** (`packages/ai-provider` → `config-node.ts`):

1. `GENOFFICE_AI_CONFIG`
2. `<Electron userData>/ai-api.config.json`
3. monorepo / search roots
4. `<cwd>/ai-api.config.json`

### Local slide page generation

- Genspark (gsk) session → prefer cloud `slide_generate`
- Otherwise → local fallback (`apps/slides/src/main/local-page-generate.ts`)
- `GENOFFICE_CLOUD_SLIDE=0` disables both
- Optional: `GENOFFICE_CLOUD_SLIDE_TIER=standard` on the cloud path

## Development

```bash
npm install
npm run fixtures
npm test
npm run typecheck
npm run dev
npm run dist:mac   # / dist:win / dist:linux
```

Sheets needs a Rust toolchain (`cargo` on PATH).

## Branding note

| Surface | This fork |
| ------- | --------- |
| Display name / window title | Office AI |
| Installers / Linux package | `OfficeAI-*`, `office-ai` |
| Default documents folder | `~/Documents/Office AI` |
| GitHub / Star links | [kingkong2019/office-ai](https://github.com/kingkong2019/office-ai) |
| npm workspaces | still `@genoffice/*` (intentional) |

GenOffice and Genspark names/logos remain trademarks of Mainfunc, Inc. This fork
uses **Office AI** as its product name and credits upstream GenOffice.

## FAQ

**Is this free?** Yes — Apache-2.0, same as upstream (except `ee/` enterprise license).

**Do I need a Genspark account?** Not for basic chat if you configure a custom provider. Cloud tools and cloud slide layout still need Genspark.

**Offline?** Document editing is local. Custom providers can point at a LAN LLM. Local slide pages do not need Genspark cloud.

## License

Apache License 2.0 — see [LICENSE](LICENSE). The `ee/` directory uses the
[GenOffice Enterprise License](ee/LICENSE).
