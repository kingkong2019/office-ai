# [GenOffice](https://genoffice.ai/)（office-ai 分支）

**面向 AI 编辑的全功能开源办公套件。**

[English](./README.md) · [中文](./README.zh-CN.md)

本仓库（[kingkong2019/office-ai](https://github.com/kingkong2019/office-ai)）
是上游 [genspark-ai/genoffice](https://github.com/genspark-ai/genoffice) 的归档分支，
在保留原能力的基础上增加了**本地 AI 提供商配置**与**离线友好的幻灯片页生成**。
若不配置自定义文件，行为与上游一致（Genspark 登录 + 云端工具）。

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Upstream releases](https://img.shields.io/github/v/release/genspark-ai/genoffice)](https://github.com/genspark-ai/genoffice/releases/latest)

[官网](https://genoffice.ai/) · [上游下载](https://github.com/genspark-ai/genoffice/releases/latest) · [演示视频](https://www.youtube.com/watch?v=B2pLdMX95v4) · [本仓库](https://github.com/kingkong2019/office-ai)

GenOffice 是免费开源的 Microsoft Office 替代方案，支持 macOS、Windows 与 Linux。
AI 编辑是一等公民工作流，而非外挂聊天框。原生打开 / 保存 Word（`.docx`）、
Excel（`.xlsx`）、PowerPoint（`.pptx`），并支持 PDF 与 Markdown：文字、表格、
演示、PDF、Markdown 共六个 Electron 应用，共享同一套引擎层。

[![Meet GenOffice — the world's first full-featured open-source AI Office (video)](https://img.youtube.com/vi/B2pLdMX95v4/maxresdefault.jpg)](https://www.youtube.com/watch?v=B2pLdMX95v4)

[在 YouTube 观看演示](https://www.youtube.com/watch?v=B2pLdMX95v4)

## 功能亮点

- **真正的 PDF 编辑** — 在页面内改字、改图，保留原字体。
- **与 Word 兼容的字节级保留 `.docx` 编辑** — 只重写你改过的部分；用 Word 再打开几乎无感。
- **贴近 Word 的分页** — 分页位置尽量对齐 Word。
- **兼容 Excel 的表格** — 自研引擎 + Rust `.xlsx` 旁路、自绘图表、透视表、切片器。
- **兼容 PowerPoint 的演示文稿** — 自研 `.pptx` 引擎，母版 / 版式 / 智能参考线 / 非破坏性裁剪。
- **本地 Markdown → Word** — 同一套 OOXML 引擎，无需 Pandoc、无需上云。
- **会改文档的 AI** — 块级编辑、快照与 diff、文档感知 Agent。
- **自带大模型（BYO LLM）** — 通过 `ai-api.config.json` 将 Docs / Sheets / Slides 指向 OpenAI 兼容、Anthropic 或自定义接口（无需 Genspark 登录）。
- **本地幻灯片页生成** — 云端 `slide_generate` 不可用时，`generate_deck` 可本地落页。
- **内置 Agent 工具** — 网页 / 图片搜索、生图、媒体分析（使用这些工具时需要 Genspark 账号）。
- **浅色 / 深色 / 跟随系统主题。**
- **macOS、Windows、Linux。**
- **免费开源（Apache-2.0）。**

## 下载

| 平台 | 要求 | 下载 |
| ---- | ---- | ---- |
| **macOS** — Apple Silicon (arm64) | macOS 11+ | [GenOffice-0.6.389-arm64.dmg](https://github.com/genspark-ai/genoffice/releases/download/v0.6.389/GenOffice-0.6.389-arm64.dmg) |
| **macOS** — Intel (x64) | macOS 11+ | [GenOffice-0.6.389.dmg](https://github.com/genspark-ai/genoffice/releases/download/v0.6.389/GenOffice-0.6.389.dmg) |
| **Windows** (x64) | Windows 10+ | [GenOfficeSetup-v0.6.389.exe](https://github.com/genspark-ai/genoffice/releases/download/v0.6.389/GenOfficeSetup-v0.6.389.exe) |
| **Linux** — Debian / Ubuntu | x86_64，glibc 2.34+（Ubuntu 22.04 或更新） | [genoffice_0.6.389_amd64.deb](https://github.com/genspark-ai/genoffice/releases/download/v0.6.389/genoffice_0.6.389_amd64.deb) |
| **Linux** — Fedora / RHEL / openSUSE | x86_64，glibc 2.34+（Fedora 35+、RHEL 9+、Leap 15.6+） | [genoffice-0.6.389.x86_64.rpm](https://github.com/genspark-ai/genoffice/releases/download/v0.6.389/genoffice-0.6.389.x86_64.rpm) |
| **Linux** — 其他发行版 | x86_64，glibc 2.34+，FUSE 2 | [GenOffice-0.6.389.AppImage](https://github.com/genspark-ai/genoffice/releases/download/v0.6.389/GenOffice-0.6.389.AppImage) |

构建来自上游 `main`；macOS / Windows 安装包已签名。
历史版本见 [Releases](https://github.com/genspark-ai/genoffice/releases)。

### 在 Linux 上安装

deb 可用 apt 安装（会拉依赖并加入应用菜单）：

```bash
sudo apt install ./genoffice_0.6.389_amd64.deb
```

Fedora / RHEL 系 / openSUSE 用 rpm：

```bash
sudo dnf install ./genoffice-0.6.389.x86_64.rpm     # Fedora / RHEL 系
sudo zypper install ./genoffice-0.6.389.x86_64.rpm  # openSUSE
```

AppImage 可直接运行：先装 FUSE 2（`sudo apt install libfuse2`；Ubuntu 24.04 为 `libfuse2t64`），再赋权执行：

```bash
chmod +x GenOffice-0.6.389.AppImage
./GenOffice-0.6.389.AppImage
```

## 应用一览

| 目录 | 产品 | 说明 |
| ---- | ---- | ---- |
| `apps/docs` | **GenOffice Docs** | `.docx` 文字处理。字节级往返：仅对脏段落做 paragraph patch，其余按字节保留，Word 再打开不破版。分页视图复现原文档行度量；修订、批注、样式、公式、墨迹等。 |
| `apps/sheets` | **GenOffice Sheets** | `.xlsx` 表格。UI 基于开源 [Univer](https://github.com/dream-num/univer)（Apache-2.0）并大量自研扩展；导入导出走 Rust 旁路（calamine + IronCalc）；图表自绘（Konva）；透视表、切片器、条件格式、公式追踪。 |
| `apps/slides` | **GenOffice Slides** | `.pptx` 演示。自研解析 / 渲染 / 编辑引擎，含母版、图表、裁剪、墨迹与文字整形（HarfBuzz 度量）。 |
| `apps/pdf` | **GenOffice PDF** | `.pdf` 查看 / 编辑，基于 [pdf.js](https://github.com/mozilla/pdf.js) + [pdf-lib](https://github.com/Hopding/pdf-lib)：批注、表单、大纲、图章、签名、页面操作与打印。真文本编辑（段内回流、对齐还原、原字体）与内容流插图 / 改图，经 [PDFium](https://pdfium.googlesource.com/pdfium/) wasm 重写页面内容流并子集嵌入字体——不是盖章式遮罩。 |
| `apps/markdown` | **GenOffice Markdown** | `.md` / `.markdown` 编辑器：Tiptap 块编辑器，标题 / 列表 / 表格 / 图片 / 代码块，存回纯 Markdown，由 shell 标签页托管。 |
| `apps/shell` | **GenOffice** | 套件壳：首页、五个编辑器的标签托管、浅色 / 深色 / 系统主题、自动更新。 |

各应用内嵌同一套 AI 面板：Docs 为块级编辑 + 版本快照 / diff；其余应用为可对工作簿 / 幻灯片 / PDF 状态调工具的 Agent。

整套 UI 主题基于共享 design tokens（`packages/ui`），CI 约束 chrome 用色。深色模式下文档区仍为浅色纸面（类似 Word：深色外壳 + 白纸），保证渲染与导出一致。

**AI 后端。** 两种模式：

1. **Genspark（上游默认）** — 设备码登录；模型请求经 Genspark 代理（Claude / GPT / Gemini）。同一账号解锁 gsk 工具（网页 / 图搜、生图改图、媒体分析、转写），见 `packages/ai-search`。
2. **自定义提供商（本分支）** — 在仓库根目录或 Electron `userData` 放置 `ai-api.config.json`，设置 `defaultProvider` / `allowNonGensparkProvider`，即可用自有 API Key 与 base URL。详见下方 [自定义 AI API 配置](#自定义-ai-api-配置)。

## 自定义 AI API 配置

复制示例后在本地填写密钥（真实配置文件已 gitignore）：

```bash
cp ai-api.config.example.json ai-api.config.json
```

最小结构：

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

**加载顺序**（`packages/ai-provider` → `config-node.ts`）：

1. `GENOFFICE_AI_CONFIG` — 配置文件路径  
2. `<Electron userData>/ai-api.config.json`  
3. monorepo / search roots（从 `apps/shell` 跑 `npm run dev` 时仍能找到仓库根配置）  
4. `<cwd>/ai-api.config.json`

`npm run dev` 在存在根配置时会把 `GENOFFICE_AI_CONFIG` 指到 monorepo 根。
提供商元数据与流式调用在 `packages/ai-provider`；渲染进程只导入 `providers-meta`（不引入 Node `fs`）。

### 本地幻灯片页生成

Slides 的 `generate_deck` / 单页生成：

- 已有 Genspark（gsk）会话 → 优先云端 `slide_generate`。
- 否则 → **本地回退**（`apps/slides/src/main/local-page-generate.ts`）按规划的标题 / brief 生成单页 `.pptx`，自定义提供商下仍可出稿。
- `GENOFFICE_CLOUD_SLIDE=0` 会同时关闭云端与本地页生成。
- 走云端时可选用 `GENOFFICE_CLOUD_SLIDE_TIER=standard`。

成功日志示例：
`[cloud-slide] page generated: mode=local|cloud ...`

## 引擎包

均为纯 TypeScript，无 Electron 依赖，带单测（UI kit 除外）：

- `packages/docx-engine` — docx 解析 → 块树（`docxIndex` 锚点与透传）、OOXML 片段生成、字节级段落 patch。
- `packages/pptx-engine` / `packages/pptx-render` — pptx 模型与渲染。
- `packages/file-parse` — AI 附件文本抽取（办公与文本格式）。
- `packages/agent-core` — 各应用共享的 Agent 循环与 skill 组合。
- `packages/ai-provider` — 提供商抽象、流式调用，以及 `ai-api.config.json` 加载（`config.ts` / `config-node.ts` / `providers-meta.ts`）。
- `packages/ai-search` — Genspark 鉴权与网页 / 图搜工具。
- `packages/i18n`、`packages/ui`、`packages/project-store`、`packages/electron-utils` — 共享 i18n、React UI kit、最近文件、Electron 主进程工具。

## 开发

```bash
npm install
npm run fixtures     # 生成测试用 .docx fixtures
npm test             # 引擎 + 应用单测（docs/sheets/slides 无需显示器）
npm run typecheck    # 各 workspace 执行 tsc --noEmit
npm run dev          # 五个编辑器 + shell，对接 Vite 开发服
npm run dev:docs     # 只跑单个应用（其他 workspace 同理）
npm run dist:mac     # 打包 macOS dmg（会重生 third-party notices）
npm run dist:win     # 打包 Windows nsis 安装包
npm run dist:linux   # 打包 Linux AppImage + deb + rpm
```

Sheets 还需要 Rust 工具链（`cargo` 在 PATH 上）；
`npm run build -w @genoffice/sheets` 会自动编译 xlsx 旁路。

本地 UI / e2e 驱动脚本（Playwright + Electron，默认不提交）见
[`scripts/drivers/`](scripts/drivers/README.md)。

## 架构说明（docx 往返）

```
打开 docx ─► 按 hash 归档原件（永不改动）
         ─► docx-engine 解析 word/document.xml 顶层元素（w:p / w:tbl / …）
         ─► 块树，每块带 docxIndex + 原始 XML 切片
         ─► Tiptap 流式编辑器（手工 + AI 编辑，脏标记）
保存     ─► 脏块 → OOXML 片段（只引用已有样式）
         ─► 拼回原 document.xml（未改块保留原始字节）
         ─► 重新打包 zip；其余条目按字节复制
```

Sheets / Slides 同一原则：原文件是真相来源，编辑做成窄 patch，未触碰部分往返不变。

## 常见问题

**GenOffice 免费吗？**  
是。Apache-2.0 开源免费——应用本身无试用期、无付费档。

**能打开 Microsoft Word / Excel / PowerPoint 吗？**  
能。原生打开并保存 `.docx` / `.xlsx` / `.pptx`。保存为字节级保留：未改部分原样写回，文档在 Microsoft Office 中仍可正常使用。

**能离线用吗？**  
文档编辑完全本地——打开 / 编辑 / 保存不离开本机。若自定义提供商指向局域网内 OpenAI 兼容服务，对话也可留在局域网。使用 Genspark 登录、gsk Agent 工具（搜索 / 图片 / 媒体）以及云端 `slide_generate` 时仍需联网；本地幻灯片页生成不依赖这些。

**必须要有 Genspark 账号吗？**  
做基础 AI 对话不必：在 `ai-api.config.json` 中设 `allowNonGensparkProvider: true` 且 `defaultProvider` 非 genspark 即可。上游云端工具与云端幻灯片排版路径仍需要 Genspark。

**能编辑 PDF 吗？**  
能——真正重写页面内容流的文本与图片编辑，保留原字体，不是遮罩批注。

## 安全

进程安全姿态（渲染进程沙箱、IPC 校验、外链门控）以及 AI 生成内容威胁模型见 [SECURITY.md](SECURITY.md)。

## 致谢

GenOffice 离不开这些开源项目：

- [Electron](https://www.electronjs.org/) — 各应用的桌面运行时。
- [Univer](https://github.com/dream-num/univer)（Apache-2.0）— Sheets 扩展的表格 UI 核心。
- [PDFium](https://pdfium.googlesource.com/pdfium/)（BSD-3-Clause，经 [@embedpdf/pdfium](https://github.com/embedpdf/embed-pdf-viewer) 打包）— 真 PDF 文本 / 图片编辑的内容流引擎。
- [pdf.js](https://github.com/mozilla/pdf.js)（Apache-2.0）与 [pdf-lib](https://github.com/Hopding/pdf-lib)（MIT）— PDF 渲染与文档组装。
- [Tiptap](https://tiptap.dev/) / [ProseMirror](https://prosemirror.net/) — Docs 与 Markdown 的块编辑器。
- [Konva](https://konvajs.org/) — Slides 与 Sheets 图表的画布渲染。
- [HarfBuzz](https://github.com/harfbuzz/harfbuzz)（wasm）— 复杂文字整形度量。
- [calamine](https://github.com/tafia/calamine) 与 [IronCalc](https://github.com/ironcalc/IronCalc) — Rust xlsx 旁路的读表与计算层。
- Liberation、Carlito、Caladea、Noto CJK 字体（OFL/Apache-2.0）— 内嵌文档字体。

## 第三方声明

`npm run notices` 会重生捆绑的第三方许可摘要（`tools/gen-third-party-notices.mjs`）；
运行时依赖均为 MIT / Apache-2.0 / BSD-3-Clause / OFL，内嵌字体（Liberation、Carlito、Caladea、Noto CJK 子集）为 OFL / Apache。

## 许可

GenOffice 采用 [Apache License 2.0](LICENSE)，例外：`ee/` 目录预留给未来企业模块，适用 [GenOffice Enterprise License](ee/LICENSE)。

GenOffice 与 Genspark 名称及标识为 Mainfunc, Inc. 商标。
Apache-2.0 不授予使用这些商标的权利（见第 6 节）；分支请使用自有品牌。
