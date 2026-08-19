# Office AI

**面向 AI 的办公套件** — 基于 [GenOffice](https://github.com/genspark-ai/genoffice) 的公开分支，
增加自定义大模型配置与更友好的本地幻灯片页生成。

[English](./README.md) · [中文](./README.zh-CN.md)

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Upstream GenOffice](https://img.shields.io/github/v/release/genspark-ai/genoffice?label=upstream)](https://github.com/genspark-ai/genoffice/releases/latest)

**本仓库：** [kingkong2019/office-ai](https://github.com/kingkong2019/office-ai)  
**上游：** [genspark-ai/genoffice](https://github.com/genspark-ai/genoffice) · [genoffice.ai](https://genoffice.ai/) · [演示](https://www.youtube.com/watch?v=B2pLdMX95v4)

Office AI 保留 GenOffice 引擎栈（Docs / Sheets / Slides / PDF / Markdown，统一 Electron 壳），并增加：

- **自定义 AI 提供商**：`ai-api.config.json`（OpenAI 兼容 / Anthropic / 自定义；对话不必登录 Genspark）
- **本地幻灯片页生成**：云端 `slide_generate` 不可用时仍可 `generate_deck`

内部 npm 包名仍为 `@genoffice/*`，便于跟上游同步。对外**产品名、安装包、GitHub 链接、默认文件夹**使用 **Office AI**。

## 功能亮点

- 真 PDF 编辑、字节级保留的 `.docx`、兼容 Excel / PowerPoint
- 本地 Markdown → Word
- 文档级 AI 编辑与 Agent 工具
- BYO LLM + 本地幻灯片落页
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
