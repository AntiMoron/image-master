# image-master 图片大师

为 **GPT Image 2**（OpenAI）和 **Nano Banana Pro**（Google Gemini）生成高质量提示词的 Claude Code Skill，内置 255 条真实社区提示词，并可直接调用 API 生成图片文件。

---

## 前置条件

- [Claude Code](https://claude.ai/code) 已安装
- Node.js 18+
- Git

---

## 安装

### 第一步：克隆仓库

```bash
git clone git@github.com:AntiMoron/image-master.git
cd image-master
```

### 第二步：运行安装脚本

```bash
bash install.sh
```

脚本会自动完成：

| 步骤 | 说明 |
|------|------|
| `npm install` | 安装 OpenAI 和 Google GenAI 依赖 |
| 复制 `skill.md` | 注册 `/image-master` 指令到 Claude Code |
| 复制 `prompts.json` | 255 条社区提示词供 AI 参考 |
| 写入 `config.json` | 记录本仓库路径，让 skill 能找到生成脚本 |

安装完成后，**重启 Claude Code** 或新开一个会话，`/image-master` 即可使用。

### 第三步：配置 API Key

按需配置，至少配一个：

```bash
# GPT Image 2（OpenAI）
export OPENAI_API_KEY=sk-...

# Nano Banana Pro（Google Gemini）
export GOOGLE_AI_API_KEY=AIza...
```

持久化（写入 shell 配置）：

```bash
# zsh
echo 'export OPENAI_API_KEY=sk-...' >> ~/.zshrc

# bash
echo 'export OPENAI_API_KEY=sk-...' >> ~/.bashrc
```

> 只用提示词功能、不需要 AI 直接生图的话，API Key 可以先不配。

---

## 使用

### 在 Claude Code 中

打开 Claude Code，直接输入：

```
/image-master 做一张产品爆炸图海报
/image-master gpt 信息图，人类演化时间轴 3D石阶风格
/image-master nano 水彩风格城市地图，带美食标注
/image-master 赛博朋克风格人像
```

Skill 的工作流：
1. 从 255 条真实社区提示词中找最相近的案例作为参考
2. 根据需求推荐模型（GPT Image 2 / Nano Banana Pro）
3. 输出可直接使用的完整提示词
4. 如果 API Key 已配置，可直接调用脚本帮你生成图片文件

### 命令行直接生图

```bash
# GPT Image 2
node cli.js gpt "赛博朋克城市夜景" --size 1024x1536 --quality high --output ./result.png

# Nano Banana Pro
node cli.js nano "水彩风格成都地图" --aspect 16:9 --image-size 2K

# 带参考图（Nano）
node cli.js nano "把这张照片转成水彩风格" --ref ./photo.jpg --output ./result.png

# 一次生成多张（GPT）
node cli.js gpt "产品海报" --n 4 --dir ./outputs
```

完整参数：

| 参数 | 适用 | 说明 |
|------|------|------|
| `--output <path>` | 两者 | 指定输出文件路径 |
| `--dir <dir>` | 两者 | 输出目录（默认当前目录） |
| `--size` | GPT | `1024x1024` \| `1024x1536` \| `1536x1024` \| `auto` |
| `--quality` | GPT | `low` \| `medium` \| `high` \| `auto` |
| `--n <数量>` | GPT | 一次生成多张（1-10） |
| `--aspect` | Nano | `1:1` \| `16:9` \| `9:16` \| `4:3` \| `3:4` |
| `--image-size` | Nano | `1K` \| `2K` \| `4K` |
| `--model` | Nano | `flash`（默认）\| `pro` \| `preview` |
| `--ref <path>` | Nano | 参考图路径，可多次使用 |

### 程序化调用

```javascript
const { generateImage } = require('./src');

// GPT Image 2
const results = await generateImage('gpt', '提示词内容', {
  size: '1024x1536',
  quality: 'high',
  outputPath: './output.png',
});

// Nano Banana Pro（带参考图）
const results = await generateImage('nano', '提示词内容', {
  aspectRatio: '16:9',
  imageSize: '2K',
  referenceImages: ['./ref.jpg'],
  outputPath: './output.png',
});

console.log(results[0].filePath); // 返回生成的文件路径
```

---

## 更新提示词数据库

```bash
node scripts/fetch-prompts.js
```

从上游 awesome 仓库重新拉取最新提示词，同时更新 `prompts.json` 和 `~/.claude/skills/image-master/prompts.json`。

---

## 数据来源

- [awesome-gpt-image-2](https://github.com/YouMind-OpenLab/awesome-gpt-image-2) — 126 条
- [awesome-nano-banana-pro-prompts](https://github.com/YouMind-OpenLab/awesome-nano-banana-pro-prompts) — 129 条
