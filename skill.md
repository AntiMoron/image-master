# image-master 图片大师

为 **GPT Image 2**（OpenAI）和 **Nano Banana Pro**（Google）生成高质量提示词。

## 用法

```
/image-master [描述你想要的图片]
/image-master gpt [描述]
/image-master nano [描述]
```

## 示例

```
/image-master 做一张产品爆炸图海报
/image-master gpt 信息图，人类演化时间轴 3D石阶风格
/image-master nano 水彩风格城市地图
/image-master 赛博朋克风格人像，带文字排版
```

---

## 程序化生成图片（Node.js 脚本）

仓库 `~/image-master` 提供了可直接调用的 Node.js 客户端。生成提示词后，可帮用户直接运行脚本生成图片文件。

### 环境配置

```bash
cd ~/image-master
npm install

# 配置 API Key（二选一或两者都配）
export OPENAI_API_KEY=sk-...        # GPT Image 2
export GOOGLE_AI_API_KEY=AIza...    # Nano Banana Pro
```

### CLI 调用

```bash
# GPT Image 2
node cli.js gpt "prompt内容" --size 1024x1536 --quality high --output ./result.png
node cli.js gpt "prompt内容" --n 4 --dir ./outputs

# Nano Banana Pro
node cli.js nano "prompt内容" --aspect 16:9 --image-size 2K --output ./result.png
node cli.js nano "prompt内容" --ref ./reference.jpg   # 带参考图
node cli.js nano "prompt内容" --model pro             # 换更高质量模型
```

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
const results = await generateImage('gpt', prompt, {
  size: '1024x1536',
  quality: 'high',
  n: 1,
  outputPath: './output.png',
});

// Nano Banana Pro（带参考图）
const results = await generateImage('nano', prompt, {
  aspectRatio: '16:9',
  imageSize: '2K',
  model: 'flash',
  referenceImages: ['./ref.jpg'],
  outputPath: './output.png',
});

console.log(results[0].filePath); // 返回文件路径
```

### 何时帮用户运行脚本

生成提示词后，如果用户环境中 API Key 已配置，可以主动用 Bash 工具执行：

```bash
cd ~/image-master && node cli.js <model> "<prompt>" [options]
```

---

## 操作流程

当 `/image-master` 被调用时，按照以下步骤执行：

### 第一步：解析参数

- 如果 args 以 `gpt` 开头 → 锁定 GPT Image 2
- 如果 args 以 `nano` 开头 → 锁定 Nano Banana Pro
- 如果没有指定模型 → 根据需求智能推荐（见模型选择指南）
- 如果完全没有 args → 先问用户想做什么

### 第二步：理解需求，识别分类

从用户描述中提取三个维度：

**使用场景（Use Case）：**
- 个人资料/头像、社交媒体帖子、信息图/教育视觉图
- YouTube缩略图、漫画/故事板、产品营销
- 电商主图、游戏素材、海报/传单、App/网页设计

**风格（Style）：**
- 摄影、电影/电影剧照、动漫/漫画、插画、草图/线稿
- 漫画/图画小说、3D渲染、Q版/Q萌风、等距、像素艺术
- 油画、水彩画、水墨/中国风、复古/怀旧、赛博朋克/科幻、极简主义

**主体（Subject）：**
- 人像/自拍、网红/模特、角色、团体/情侣、产品、食品/饮料
- 时尚单品、动物/生物、车辆、建筑/室内设计、风景/自然
- 城市风光/街道、图表、文本/排版、摘要/背景

### 第三步：选择模型

**优先推荐 GPT Image 2 的场景：**
- 需要精准文字渲染（中文、英文、日文）
- 结构化信息图、UI界面、产品爆炸图
- 电商直播UI样机、应用界面设计
- 多图跨图一致性（角色/IP系列）
- 商用级插画（直接用于商业）
- 多语言平面设计、Banner、海报排版
- 复杂JSON结构的提示词

**优先推荐 Nano Banana Pro 的场景：**
- 参考照片处理（人脸保留、风格迁移）
- 水彩地图、手绘地图信息图
- 多角色/多场景拼图（2x2网格等）
- 黑板风格/手绘风格教育图
- 快速迭代、多风格切换
- 日文/韩文提示词风格
- 自然语言描述风格

**两者均适合：**
- 动漫/插画风格（GPT Image 2更精细，Nano Banana Pro更自然）
- 人像（GPT Image 2更商业感，Nano Banana Pro更擅长参考图）

### 第四步：生成提示词

根据场景选择合适的提示词模式，生成高质量提示词。

---

## 提示词模板库

### GPT Image 2 模板

#### 模板A：结构化产品/海报（JSON风格）
```
{
  "type": "[图像类型，如：产品爆炸视图海报]",
  "subject": "[主体描述]",
  "style": "[风格描述，如：简洁的高科技3D渲染，摄影棚灯光]",
  "background": "[背景色或场景]",
  "header": {
    "logo": "[Logo文字]",
    "subtitle": "[副标题/口号]"
  },
  "layout": {
    "centerpiece": "[核心视觉描述]",
    "callout_labels": {
      "count": [数量],
      "left_side": ["[标注1]", "[标注2]"],
      "right_side": ["[标注1]", "[标注2]"]
    },
    "footer": {
      "left_text_block": {
        "headline": "[底部标题]",
        "body": "[底部文案]"
      },
      "right_logo": "[Logo]"
    }
  }
}
```

#### 模板B：信息图（JSON风格）
```
{
  "type": "[信息图类型，如：演化时间轴信息图]",
  "style": {
    "background": "[背景风格]",
    "main_visual": "[主视觉风格]",
    "subjects": "[内容元素风格]"
  },
  "layout": {
    "main_title": "[主标题]",
    "sections": [
      {
        "position": "[位置，如：左侧边栏]",
        "count": [数量],
        "labels": ["[标签1]", "[标签2]"]
      }
    ],
    "centerpiece": {
      "description": "[核心视觉描述]",
      "count": [元素数量],
      "notable_elements": ["[元素1]", "[元素2]"]
    }
  }
}
```

#### 模板C：动漫/插画场景（自然语言）
```
一幅极具动态感的[风格]插画，描绘了[场景描述]。[角色1描述，包含发型、服装、动作、能量效果]。[角色2描述]。背景是[场景细节]。场景充满了[氛围描述，如：爆发性的动作感，飞扬的尘土、破碎的地板、发光的彩色粒子特效]，以及[光影描述]。
```

#### 模板D：UI样机（JSON风格）
```
{
  "type": "[UI类型，如：直播UI样机]",
  "subject": {
    "description": "[人物/产品描述]",
    "background": "[背景描述]"
  },
  "ui_overlay": {
    "top_header": { "[UI顶部元素]" },
    "mid_content": { "[中部内容]" },
    "bottom_bar": { "[底部导航]" }
  }
}
```

#### 模板E：手绘地图/美食地图（JSON风格）
```
{
  "type": "手绘地图信息图",
  "style": "[风格，如：复古羊皮纸上的水彩墨水手绘插画]",
  "title_section": {
    "text": "[城市名] [地图标题]",
    "mascot": "[吉祥物描述]"
  },
  "border": "[边框装饰]",
  "layout": {
    "background": "[地图底图风格]",
    "sections": [
      {
        "title": "[区域名称]",
        "count": [数量],
        "illustrations": ["[插图1]", "[插图2]"],
        "labels": ["[标签1]", "[标签2]"]
      }
    ],
    "centerpiece": "[中心装饰元素]"
  }
}
```

---

### Nano Banana Pro 模板

#### 模板F：引言卡/名人卡（自然语言）
```
一张宽幅引言卡片，上面印有[名人]，背景为[颜色]，引言文字为[字体风格]字体："[名言内容]"，下方是较小的文字："—[作者]"。文字前面有一个大而柔和的引号。人物肖像在[位置]，文字在[位置]。文字占据图片的[比例]，肖像占据[比例]，肖像部分带有轻微的渐变过渡效果。
```

#### 模板G：液态玻璃Bento产品信息图（自然语言）
```
输入变量：[产品名称]
语言：[语言]

创建一个包含[数量]个模块的优质液态玻璃Bento网格产品信息图。
调色板基于产品主色调，卡片采用Apple液态玻璃风格（85-90%透明），带有极细边框和微妙的阴影。
背景：[飘渺/微距/图案/情境]风格，高度模糊。
模块内容：
M1 — 主打产品展示
M2 — 核心优势（[数量]个）
M3 — 使用方法（[数量]种）
M4 — 关键指标/参数
M5 — 适用人群
M[n] — [其他模块]
输出：1张图片，16:9横向，超优质液态玻璃信息图。
```

#### 模板H：手绘风格/黑板风格（自然语言）
```
[风格描述，如：使用黑板风格、手写体的外观]总结[内容主题]，像[参照对象，如：老师写的一样]，用[元素，如：图表和易于理解的表达方式]进行分解。

内容：
[需要可视化的内容]
```

#### 模板I：多图拼图/四格布局（自然语言）
```
[关键：保持精确的面部特征，保留原始面部结构] 高端[拍摄风格] [格数]格照片。

[面板1位置]（[背景色]背景）：人物身穿[服装]，[发型]。[动作描述]。背景是[背景元素]。

[面板2位置]（[背景色]背景）：同一位[角色]身穿[服装]。[动作描述]。背景是[背景元素]。

[其他面板类似...]

[拼图中心]：四块拼图在画面中心形成完整的"[主题文字]"。[特效描述]。

[技术参数：清晰的妆容，明亮的环形灯，85mm镜头，f/1.8光圈，时尚杂志风格。]
```

#### 模板J：复古专利文件（自然语言）
```
一份关于[发明名称]的复古专利文件，其风格仿照19世纪末[国家]专利局的备案文件。页面上印有精确的技术图纸，并带有编号标注（图1、图2、图3），展示了正面、侧面和分解视图。钢笔墨水手写批注描述了[机械/装置]。纸张呈陈旧的象牙色，带有锈斑和柔和的折痕。角落处有一个官方浮雕印章和[颜色]蜡封。底部有发明者的手写签名和日期。整个图像给人一种从档案中找回的权威、历史且略带神秘感的文件之感。
```

#### 模板K：水彩地图（自然语言）
```
生成一张水彩风格的[地点/国家]地图，并在地图上用[工具，如：圆珠笔]标出[内容，如：所有州/城市/美食地点]。[可选：添加图例、标注、吉祥物等]
```

---

## 执行时的输出格式

生成提示词时，输出以下结构：

```
## 模型推荐
[GPT Image 2 / Nano Banana Pro] — [一句话说明为什么选这个模型]

## 分类标签
- 使用场景：[场景]
- 风格：[风格]
- 主体：[主体]

## 生成提示词

[完整的提示词内容]

## 使用提示
[可选：1-2条使用建议，如如何调整参数、参考图片的用法等]

## 更多模板参考
- GPT Image 2: https://youmind.com/zh-CN/gpt-image-2-prompts
- Nano Banana Pro: https://youmind.com/zh-CN/nano-banana-pro-prompts
```

---

## 澄清问题模板

当需要向用户提问时，简洁提问，一次最多问3个问题：

```
我来帮你生成提示词！需要确认几点：

1. **模型**：GPT Image 2（文字精准/UI设计/信息图）还是 Nano Banana Pro（参考照片/水彩/多风格）？
2. **风格**：[给出2-3个与需求相关的选项]
3. **关键内容**：[最重要的一个信息，如：品牌名、主角描述、地图城市等]
```

---

## 注意事项

- 始终用中文和用户沟通，提示词根据目标语言调整（英文提示词效果通常更好，但中文也支持）
- 对于 GPT Image 2 的复杂信息图，优先使用JSON结构格式
- 对于 Nano Banana Pro 的人像类，提醒用户可以上传参考照片
- Raycast Friendly 的提示词支持 `{argument name="x" default="y"}` 动态参数语法，适合需要复用的模板
