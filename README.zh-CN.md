# Office AI

> 开源 AI 办公套件 · 基于 [GenOffice](https://github.com/genspark-ai/genoffice) · 自带大模型 · 本地幻灯片

[English](./README.md) · **中文** · [仓库](https://github.com/kingkong2019/office-ai) · [上游](https://github.com/genspark-ai/genoffice) · [演示](https://www.youtube.com/watch?v=B2pLdMX95v4)

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Upstream](https://img.shields.io/github/v/release/genspark-ai/genoffice?label=upstream%20GenOffice)](https://github.com/genspark-ai/genoffice/releases/latest)
[![Node](https://img.shields.io/badge/node-%3E%3D22.12-brightgreen)](package.json)

---

## 本项目特色

| # | 亮点 | 一句话 |
| - | ---- | ------ |
| **1** | **自带大模型（BYO LLM）** | 一份 `ai-api.config.json` 接 OpenAI 兼容 / Anthropic / 自定义网关，**对话不必登录 Genspark** |
| **2** | **本地幻灯片页生成** | 云端 `slide_generate` 不可用时，`generate_deck` 仍按标题 / brief **本地落页** |
| **3** | **文档可完全离线** | Office / PDF / Markdown 本机编辑；可配局域网或本机模型，流量不出内网 |
| **4** | **字节级 Office 保真** | 只重写改过的部分，未改 OOXML 按字节保留，回到 Microsoft Office 仍友好 |
| **5** | **真正的 PDF 编辑** | 重写页面内容流（文字 + 图片）并保留原字体，不是盖章式遮罩 |
| **6** | **一套壳，五个编辑器** | Word / Excel / PowerPoint / PDF / Markdown 统一壳，共享 AI 面板与 Agent |
| **7** | **跟上游 · 自有品牌** | 需要时仍可用 Genspark 云端工具；对外产品名为 **Office AI**，内部包名保留 `@genoffice/*` |

---

## 快速开始

```bash
git clone https://github.com/kingkong2019/office-ai.git
cd office-ai
cp ai-api.config.example.json ai-api.config.json   # 填入你的 API
npm install
npm run dev
```

打包：`npm run dist:mac` · `dist:win` · `dist:linux`  
产物示例：`OfficeAI-*.dmg` / `.exe` / `.AppImage`，`office-ai_*.deb` / `.rpm`

> Sheets 需要本机 `cargo`（Rust）。

---

## 应用一览

| 目录 | 产品 | 能力 |
| ---- | ---- | ---- |
| `apps/docs` | **Office AI Docs** | `.docx` 字节级往返 |
| `apps/sheets` | **Office AI Sheets** | `.xlsx`（Univer + Rust 旁路） |
| `apps/slides` | **Office AI Slides** | `.pptx` + 本地/云端落页 |
| `apps/pdf` | **Office AI PDF** | 真 PDF 文本 / 图片编辑 |
| `apps/markdown` | **Office AI Markdown** | Markdown 标签页 |
| `apps/shell` | **Office AI** | 首页 · 多标签 · 主题 · 更新 |

**AI 后端**

1. **Genspark（上游默认）** — 设备码登录；模型与 gsk 工具走云端  
2. **自定义提供商（本分支）** — `ai-api.config.json` + `allowNonGensparkProvider`

---

## 自定义 AI 配置

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

**加载顺序**

1. `GENOFFICE_AI_CONFIG`  
2. `<userData>/ai-api.config.json`  
3. monorepo / search roots  
4. `<cwd>/ai-api.config.json`

### 本地幻灯片页

| 条件 | 行为 |
| ---- | ---- |
| 已有 gsk 会话 | 优先云端 `slide_generate` |
| 无 gsk | 本地回退 `local-page-generate.ts` |
| `GENOFFICE_CLOUD_SLIDE=0` | 云端与本地页生成均关闭 |

---

## 引擎能力（继承上游）

- 真 PDF 编辑 · 字节级保留 `.docx` · 贴近 Word 分页  
- 兼容 Excel / PowerPoint · 本地 Markdown → Word  
- 文档级 AI 编辑与 Agent（搜索 / 生图等走 Genspark 时需账号）  
- 浅色 / 深色 / 跟随系统 · macOS / Windows / Linux · Apache-2.0  

上游预编译包仍为 GenOffice 品牌，见 [英文 README 下载表](./README.md#download)。

---

## 品牌对照

| 表面 | 本分支 |
| ---- | ------ |
| 显示名 / 窗口标题 | **Office AI** |
| 安装包 / Linux 包名 | `OfficeAI-*` · `office-ai` |
| 默认文档目录 | `~/Documents/Office AI` |
| GitHub / Star | [kingkong2019/office-ai](https://github.com/kingkong2019/office-ai) |
| npm workspaces | `@genoffice/*`（有意保留，便于同步上游） |

GenOffice / Genspark 为 Mainfunc, Inc. 商标。本分支以 **Office AI** 为产品名，并注明源自上游。

---

## 常见问题

**免费吗？**  
是 · Apache-2.0（`ee/` 另有[企业许可](ee/LICENSE)）。

**必须 Genspark 账号吗？**  
配置自定义提供商后，基础对话不必；云端工具与云端幻灯片排版仍需要。

**能离线吗？**  
文档编辑本地；自定义提供商可指向局域网 LLM；本地幻灯片页不依赖 Genspark 云端。

---

## 许可

[Apache License 2.0](LICENSE) · `ee/` → [GenOffice Enterprise License](ee/LICENSE)
