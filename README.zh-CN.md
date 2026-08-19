# Office AI

**面向 AI 的办公套件** — 基于 [GenOffice](https://github.com/genspark-ai/genoffice) 的公开分支。
特色见下方 **[本项目特色](#本项目特色重点)**（自带大模型、本地幻灯片、离线文档等编号条目）。

[English](./README.md) · [中文](./README.zh-CN.md)

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Upstream GenOffice](https://img.shields.io/github/v/release/genspark-ai/genoffice?label=upstream)](https://github.com/genspark-ai/genoffice/releases/latest)

**本仓库：** [kingkong2019/office-ai](https://github.com/kingkong2019/office-ai)  
**上游：** [genspark-ai/genoffice](https://github.com/genspark-ai/genoffice) · [genoffice.ai](https://genoffice.ai/) · [演示](https://www.youtube.com/watch?v=B2pLdMX95v4)

## 本项目特色（重点）

1. **自带大模型（BYO LLM）** — 一份 `ai-api.config.json` 即可把 Docs / Sheets / Slides 接到 OpenAI 兼容接口、Anthropic 或任意自定义网关；**对话不必登录 Genspark**。
2. **本地幻灯片页生成** — 云端 `slide_generate` 不可用时，`generate_deck` 仍按规划标题 / brief **本地落页**，出稿不被云端排版卡住。
3. **文档可完全离线** — `.docx` / `.xlsx` / `.pptx` / PDF / Markdown 本地打开、编辑、保存；再配局域网或本机模型，AI 流量也能留在内网。
4. **字节级保留的 Office 保真** — 只重写改过的部分，未改 OOXML 按字节保留，回到 Microsoft Office 仍友好。
5. **真正的 PDF 编辑** — 重写页面内容流（文字 + 图片）并保留原字体，不是盖章式遮罩批注。
6. **一套壳，五个编辑器** — Word / Excel / PowerPoint / PDF / Markdown 统一 Electron 壳，共享同一套 AI 面板与 Agent。
7. **跟得上上游，对外自有品牌** — 需要时仍可用 Genspark 云端工具；内部包名保留 `@genoffice/*` 方便同步；对外产品名 / 安装包 / GitHub 为 **Office AI**。

内部 npm 包名仍为 `@genoffice/*`，便于跟上游同步。对外**产品名、安装包、GitHub 链接、默认文件夹**使用 **Office AI**。

## 引擎能力（继承上游）

- 真 PDF 编辑、字节级保留 `.docx`、贴近 Word 的分页
- 兼容 Excel / PowerPoint；本地 Markdown → Word
- 文档级 AI 编辑与 Agent 工具（搜索 / 生图等走 Genspark 时需账号）
- 浅色 / 深色 / 跟随系统；macOS / Windows / Linux；Apache-2.0

## 下载

当前预编译安装包仍由**上游 GenOffice**发布。本仓库可用 `npm run dist:mac` / `dist:win` / `dist:linux`
打出 **Office AI** 产物（`OfficeAI-*.dmg` / `.exe` / `.AppImage`，`office-ai_*.deb` / `.rpm`）。

上游二进制（仍为 GenOffice 品牌）见英文 [README](./README.md#download) 表格。

## 应用一览

| 目录 | 产品 | 说明 |
| ---- | ---- | ---- |
| `apps/docs` | **Office AI Docs** | `.docx` 文字处理 |
| `apps/sheets` | **Office AI Sheets** | `.xlsx` 表格 |
| `apps/slides` | **Office AI Slides** | `.pptx` 演示 |
| `apps/pdf` | **Office AI PDF** | PDF 真编辑 |
| `apps/markdown` | **Office AI Markdown** | Markdown |
| `apps/shell` | **Office AI** | 套件壳 |

**AI 后端：** Genspark（上游默认）或本分支自定义提供商（见下）。

## 自定义 AI API 配置

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

**加载顺序：** `GENOFFICE_AI_CONFIG` → `<userData>/ai-api.config.json` → monorepo search roots → `<cwd>/ai-api.config.json`。

### 本地幻灯片页生成

- 有 gsk 会话 → 优先云端 `slide_generate`
- 否则 → 本地回退（`local-page-generate.ts`）
- `GENOFFICE_CLOUD_SLIDE=0` 同时关闭云端与本地页生成

## 开发

```bash
npm install
npm run fixtures
npm test
npm run typecheck
npm run dev
npm run dist:mac   # / dist:win / dist:linux
```

Sheets 需要 Rust（`cargo`）。

## 品牌说明

| 表面 | 本分支 |
| ---- | ------ |
| 显示名 / 窗口标题 | Office AI |
| 安装包 / Linux 包名 | `OfficeAI-*`、`office-ai` |
| 默认文档目录 | `~/Documents/Office AI` |
| GitHub / Star | [kingkong2019/office-ai](https://github.com/kingkong2019/office-ai) |
| npm workspaces | 仍为 `@genoffice/*`（有意保留） |

GenOffice / Genspark 名称与标识为 Mainfunc, Inc. 商标。本分支以 **Office AI** 为产品名，并注明源自上游 GenOffice。

## 常见问题

**免费吗？** 是，Apache-2.0（`ee/` 另有企业许可）。

**必须 Genspark 账号吗？** 配置自定义提供商后，基础对话不必；云端工具与云端幻灯片排版仍需要。

**能离线吗？** 文档编辑本地；自定义提供商可指向局域网 LLM；本地幻灯片页不依赖 Genspark 云端。

## 许可

[Apache License 2.0](LICENSE)。`ee/` 适用 [GenOffice Enterprise License](ee/LICENSE)。
