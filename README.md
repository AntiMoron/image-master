# image-master 图片大师

> Claude Code skill — 为 GPT Image 2 和 Nano Banana Pro 生成高质量提示词，并可直接调用 API 生成图片文件。

## 安装

```bash
git clone git@github.com:AntiMoron/image-master.git
cd image-master
bash install.sh
```

`install.sh` 会做三件事：
1. `npm install` 安装依赖
2. 把 `skill.md` 和 `prompts.json` 复制到 `~/.claude/skills/image-master/`
3. 写入 `config.json` 记录脚本位置

## 配置 API Key

```bash
export OPENAI_API_KEY=sk-...        # 使用 GPT Image 2
export GOOGLE_AI_API_KEY=AIza...    # 使用 Nano Banana Pro
```

建议写入 `~/.zshrc` 或 `~/.bashrc` 持久化。

## 在 Claude Code 中使用

```
/image-master 做一张产品爆炸图海报
/image-master gpt 信息图，人类演化时间轴 3D石阶风格
/image-master nano 水彩风格城市地图，带美食标注
/image-master 赛博朋克风格人像
```

Skill 会：
1. 从 255 条真实社区提示词中找最相近的案例
2. 推荐合适的模型（GPT Image 2 / Nano Banana Pro）
3. 生成完整提示词
4. 如果 API Key 已配置，可直接帮你调用脚本生成图片

## 命令行直接使用

```bash
# GPT Image 2
node cli.js gpt "赛博朋克城市夜景" --size 1024x1536 --quality high

# Nano Banana Pro
node cli.js nano "水彩风格成都地图" --aspect 16:9 --image-size 2K

# 带参考图
node cli.js nano "把这张照片转成水彩风格" --ref ./photo.jpg --output ./result.png

# 一次生成多张
node cli.js gpt "产品海报" --n 4 --dir ./outputs
```

## 程序化调用

```javascript
const { generateImage } = require('./src');

const results = await generateImage('gpt', '提示词内容', {
  size: '1024x1536',
  quality: 'high',
  outputPath: './output.png',
});

const results = await generateImage('nano', '提示词内容', {
  aspectRatio: '16:9',
  referenceImages: ['./ref.jpg'],
  outputPath: './output.png',
});

console.log(results[0].filePath);
```

## 更新提示词数据库

```bash
node scripts/fetch-prompts.js
```

从两个 awesome 仓库重新拉取最新提示词，覆盖本地 `prompts.json` 和 `~/.claude/skills/image-master/prompts.json`。

## 数据来源

- [awesome-gpt-image-2](https://github.com/YouMind-OpenLab/awesome-gpt-image-2)（126 条）
- [awesome-nano-banana-pro-prompts](https://github.com/YouMind-OpenLab/awesome-nano-banana-pro-prompts)（129 条）
