# Office AI

> Open-source AI office suite · fork of [GenOffice](https://github.com/genspark-ai/genoffice) · BYO LLM · local slides

**English** · [中文](./README.zh-CN.md) · [Repo](https://github.com/kingkong2019/office-ai) · [Upstream](https://github.com/genspark-ai/genoffice) · [Demo](https://www.youtube.com/watch?v=B2pLdMX95v4)

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Upstream](https://img.shields.io/github/v/release/genspark-ai/genoffice?label=upstream%20GenOffice)](https://github.com/genspark-ai/genoffice/releases/latest)
[![Node](https://img.shields.io/badge/node-%3E%3D22.12-brightgreen)](package.json)

---

## Why Office AI

| # | Highlight | In one line |
| - | --------- | ----------- |
| **1** | **Bring your own LLM** | One `ai-api.config.json` → OpenAI-compatible / Anthropic / custom gateway — **no Genspark login for chat** |
| **2** | **Local slide pages** | If cloud `slide_generate` is down, `generate_deck` still builds pages from title / brief **locally** |
| **3** | **Offline documents** | Edit Office / PDF / Markdown on-device; point AI at a LAN or localhost model |
| **4** | **Byte-preserving fidelity** | Only dirty OOXML is rewritten — Microsoft Office stays happy |
| **5** | **Real PDF editing** | Rewrite content streams (text + images), keep original fonts — not stamp overlays |
| **6** | **One shell, five editors** | Word / Excel / PowerPoint / PDF / Markdown + shared AI panel & agent |
| **7** | **Upstream-ready brand** | Optional Genspark cloud tools; ship as **Office AI**; keep `@genoffice/*` for sync |

---

## Quick start

```bash
git clone https://github.com/kingkong2019/office-ai.git
cd office-ai
cp ai-api.config.example.json ai-api.config.json   # add your API key
npm install
npm run dev
```

Package: `npm run dist:mac` · `dist:win` · `dist:linux`  
Artifacts: `OfficeAI-*.dmg` / `.exe` / `.AppImage`, `office-ai_*.deb` / `.rpm`

> Sheets needs `cargo` (Rust) on `PATH`.

---

## Apps

| Path | Product | Role |
| ---- | ------- | ---- |
| `apps/docs` | **Office AI Docs** | `.docx` byte-preserving round trip |
| `apps/sheets` | **Office AI Sheets** | `.xlsx` (Univer + Rust sidecar) |
| `apps/slides` | **Office AI Slides** | `.pptx` + local / cloud page gen |
| `apps/pdf` | **Office AI PDF** | True PDF text / image editing |
| `apps/markdown` | **Office AI Markdown** | Markdown in shell tabs |
| `apps/shell` | **Office AI** | Home · tabs · theme · updates |

**AI backend**

1. **Genspark (upstream default)** — device-code login; models & gsk tools in the cloud  
2. **Custom providers (this fork)** — `ai-api.config.json` + `allowNonGensparkProvider`

---

## Custom AI config

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

**Load order**

1. `GENOFFICE_AI_CONFIG`  
2. `<userData>/ai-api.config.json`  
3. monorepo / search roots  
4. `<cwd>/ai-api.config.json`

### Local slide pages

| When | Behavior |
| ---- | -------- |
| gsk session present | Prefer cloud `slide_generate` |
| no gsk | Local fallback (`local-page-generate.ts`) |
| `GENOFFICE_CLOUD_SLIDE=0` | Disable cloud **and** local page gen |

---

## Engine (from upstream)

- Real PDF editing · byte-preserving `.docx` · Word-like pagination  
- Excel / PowerPoint compatible · local Markdown → Word  
- Document AI + agents (Genspark account for search / image tools)  
- Light / dark / system · macOS / Windows / Linux · Apache-2.0  

### Upstream downloads (still branded GenOffice)

| Platform | Link |
| -------- | ---- |
| **macOS** arm64 | [dmg](https://github.com/genspark-ai/genoffice/releases/download/v0.6.389/GenOffice-0.6.389-arm64.dmg) |
| **macOS** x64 | [dmg](https://github.com/genspark-ai/genoffice/releases/download/v0.6.389/GenOffice-0.6.389.dmg) |
| **Windows** x64 | [exe](https://github.com/genspark-ai/genoffice/releases/download/v0.6.389/GenOfficeSetup-v0.6.389.exe) |
| **Linux** deb / rpm / AppImage | [deb](https://github.com/genspark-ai/genoffice/releases/download/v0.6.389/genoffice_0.6.389_amd64.deb) · [rpm](https://github.com/genspark-ai/genoffice/releases/download/v0.6.389/genoffice-0.6.389.x86_64.rpm) · [AppImage](https://github.com/genspark-ai/genoffice/releases/download/v0.6.389/GenOffice-0.6.389.AppImage) |

Build **Office AI** branded installers from this repo with `dist:*` above.

---

## Branding

| Surface | This fork |
| ------- | --------- |
| Display / window title | **Office AI** |
| Installers / Linux package | `OfficeAI-*` · `office-ai` |
| Default documents folder | `~/Documents/Office AI` |
| GitHub / Star | [kingkong2019/office-ai](https://github.com/kingkong2019/office-ai) |
| npm workspaces | `@genoffice/*` (kept on purpose) |

GenOffice / Genspark are trademarks of Mainfunc, Inc. This fork ships as **Office AI** and credits upstream.

---

## FAQ

**Free?**  
Yes — Apache-2.0 (except [`ee/` enterprise license](ee/LICENSE)).

**Need a Genspark account?**  
Not for basic chat with a custom provider. Cloud tools and cloud slide layout still do.

**Offline?**  
Document editing is local. Point custom providers at a LAN LLM. Local slide pages do not need Genspark cloud.

---

## License

[Apache License 2.0](LICENSE) · `ee/` → [GenOffice Enterprise License](ee/LICENSE)
