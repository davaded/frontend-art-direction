# Reference Composition

外部参考不是每次都要全部使用，也不是一张待勾选的灵感清单。把它们当作带有明确职责的 lens：先看当前产品缺什么，再选 2-4 个互不重复的参考，最后把每个参考翻译成目标项目里的具体决策。

## Selection Rule

默认最多选四个职责：

1. **Foundation**：组件结构、语义、键盘、焦点、状态覆盖和可维护性。
2. **Visual language**：构图、材质、色彩、密度、字体层级和内容节奏。
3. **Motion/state**：状态关系、连续性、反馈和动效治理。
4. **Domain specimen**：AI 状态、数据图表、媒体对象或其他真正属于产品的展示对象。

当用户明确说“微交互、hover、cursor、细节打磨”时，可以把 `micro-interaction` 作为 motion/state 的窄职责；它不能替代产品层级或基础可访问性。

不要因为参考很多就扩大组合。重复承担同一职责只会把目标产品做成拼贴。每个被选中的参考都必须记录：

- **Borrow**：可迁移的决策；
- **Reject**：明确不带入目标产品的部分；
- **Translate**：它如何落到当前产品、内容和技术约束中。

执行选择器：

```bash
node <skill-root>/scripts/reference-composition.mjs \
  --query "AI agent dashboard with approval modal" \
  --profile "agent workspace" \
  --style "instrument panel" \
  --motion "modal continuity" \
  --format md
```

`brief` 和 `audit` 会自动调用同一个选择器。默认最多四个，且不会要求用户安装参考网站的运行时或依赖。

## No-Reference Mode

如果用户只说“做一个网站”或只给出一个产品类型，没有给出案例或 URL，系统不会把某个外部网站当成默认皮肤。流程是：

1. 从产品类型、任务对象、内容密度和输入方式推断一个候选 profile；
2. 从 profile 推导 style、type、palette、motion，并给每项标注置信度；
3. 只有在确实识别出组件、数据、AI 状态或动效等职责时，才选择对应的支撑 lens；
4. 没有职责信号时保持 `selected: []`，把缺失信息列为 open evidence，等待真实内容和渲染结果验证。

这条路径生成的是 **direction assumption**，不是“已经确定的视觉风格”。用户明确说“像某个网站”或给出 URL 后，才切换到 `reference-build`，生成视觉基因、首屏结构、组件语法、动效合同和验收条件。

## Reference Roles

### Rare UI

Rare UI 当前更接近 **dark organic component showcase**（2026-09-22 已检查桌面和移动端）：

- 页面先用接近满屏、带明显大曲率的深色外壳建立整体轮廓，而不是靠多条直线切分首屏；
- 顶部导航、安装命令和行动按钮是不同层级的圆润对象，不共享一个机械的圆角数值；
- 主标题背后的有机形体既是视觉锚点，也是组件能力的证明，不是额外套上的装饰卡片；
- 下方组件区不是平均三列，而是一个大 specimen 配合右侧较小 specimen 的非对称 mosaic；
- preview frame 使用低对比边界和柔和圆角，内部组件承担主要视觉差异；
- 产品证据先于评价、赞助和社交证明。

适合借：大/中/小三级曲率、有机主体代替分割线、漂浮式导航、命令与 CTA 组合、非对称 specimen mosaic、单一强调色和局部组件动效。

不应照搬：默认黑底橙色、没有真实对象时硬造有机 blob、把所有控件都做成胶囊、或把每个交互都变成新奇动画。

### Rewamp UI

Rewamp UI 更像 **light indexed component workbench**，不是传统 landing page，也不是多卡片 gallery：

- 桌面端把可搜索、分组的组件索引固定在左侧，当前 specimen 占据一个稳定的大型浅灰舞台；
- 安装、源码、说明、主题等操作收进舞台旁的紧凑 action dock，不和组件本身争抢首读；
- demo 自己可以有强烈的材质、颜色和动效，但浏览 shell 保持安静，让一个对象成为当前主角；
- 移动端不会压缩桌面侧栏，而是换成“当前组件 + 菜单”的顶部胶囊，预览全宽，工具轨移动到底部；
- 源码、依赖、用法和 package-manager 选择围绕同一个 specimen 展开，适合从看效果直接进入实现判断。

适合借：大型组件库的信息架构、单 specimen 舞台、搜索/分类、稳定预览几何、工具轨、桌面到移动端的结构重排，以及“效果 -> 源码/安装/状态”的连续检查路径。

不应照搬：把淡灰舞台、淡紫标记和大圆角变成任何产品的默认视觉；把多个背景、cursor、text effect 或卡片特效同时塞进一个业务页面；让视觉效果替代任务、语义、键盘/触摸路径或静态 fallback。

### Shared Geometry Lesson

Rare UI 和 Rewamp UI 的共同点不是“圆角越大越高级”，而是清楚的几何层级：最大舞台最柔和，内部 specimen 次之，控件更紧凑；开放区域主要靠留白、色阶、内嵌和重叠分组，直线只在索引、代码、表格或真实边界里出现。借鉴时优先翻译这种关系，不要复制某个固定 radius。

### Beautiful UI

Beautiful UI 更像 **dark AI-native instrument editorial**：用长页面和固定索引组织大量 AI 状态，把 loading、thinking、streaming、approval、tool execution 和任务进度当作产品对象。

适合借状态展示、过程可见性、密集但有秩序的 specimen 组织。不要因此把普通业务界面默认改成纯黑，也不要把静态占位符伪装成实时 Agent 状态。

### beUI

beUI 是 **dark motion-native component registry**：用 spring、morph、drag/inertia、blur cross-fade 和 layout-preserving transition 表达对象状态变化，同时用图表和数据关系证明组件不是纯装饰。

适合借对象连续性、直接操控和少量高辨识度的运动原语。不要给每个 hover 都加弹簧，不要让 glow、glass 或动画遮住信息层级，也不要为了简单 CSS 状态引入重量级运行时。

### Bencho

Bencho 更适合当 **micro-interaction playground**：把 hover、press、cursor、focus 和局部反馈拆成可重放的单个实验。

适合借触发、响应、节奏、最终态和稳定几何。不要把 playground 的某个效果变成整站视觉，也不要让 pointer-only 行为成为唯一操作路径。

### Magic UI

Magic UI 更像 **source-owned animated component catalog**：工作示例、复制/实现入口和局部动效靠得很近。

适合借一两个有产品职责的 React 动效原语、specimen 展示和源码可改造性。不要整页拼接渐变 demo，也不要把默认 dark/glow 皮肤当成设计系统。

### React Bits

React Bits 是 **categorized React visual primitive library**，适合查找文字、cursor、background、scroll 或组件级视觉效果。

适合借“按缺失视觉 job 选一个原语”的方法。不要把多个效果堆成风格，不要让 pointer 或动画承担核心信息，也要单独验证触摸、键盘和 reduced-motion。

### Aceternity UI

Aceternity UI 更适合 **高影响力 landing block 和 hero composition**：有层叠、glow、scroll、parallax、3D-adjacent 的视觉块。

适合借一个真实对象驱动的视觉锚点、章节构图和受控滚动。不要用光晕、渐变或 3D 替代产品证据，也不要让滚动编排遮住文案、控件或移动端内容。

### Obsidian UI

Obsidian UI 偏 **interaction-first React collection**，重点是 cursor、hover、scroll 和局部直接操控。

适合借交互分类、局部边界和 source-owned 改造方式。不要把暗色和 glow 当成必选主题；所有 pointer affordance 都要有键盘、触摸和静态路径。

### Design Spells

Design Spells 更像 **interaction pattern gallery**，用于建立微交互词汇和比较桌面/移动行为，不是可直接安装的组件库。

适合借 trigger、response、context、timing 和跨设备对照。不要把案例当成代码或素材授权，也不要因为效果有记忆点就增加任务延迟。

### Transitions.dev

Transitions.dev 是动效治理参考，不是视觉主题。沿用它的 `Review -> Apply -> Refine -> Polish` 顺序：先确认动效目的和状态关系，再实现，再校正节奏，最后处理细节。每个动效还要有 cleanup、reduced-motion 和静态最终态 fallback。

### shadcn/ui

shadcn/ui 是 source-owned foundation，不是成品视觉风格。借组件 anatomy、语义、焦点、键盘行为和状态覆盖；目标项目自己拥有 tokens、密度、圆角、色彩、排版和组合方式。不要把默认中性色皮肤误当作 art direction。

## Recommended Sets

这些只是按职责组织的起点，不是固定套餐：

| Product job | Recommended lenses | Why |
| --- | --- | --- |
| 一般产品 UI | shadcn/ui + 一个 visual language + Transitions.dev（仅在需要动效时） | 先保证行为和系统性，再确定个性 |
| AI 工作台 | Beautiful UI + shadcn/ui + Transitions.dev | 状态可见、基础可靠、动效可审查 |
| 组件/动效展示站 | Rare UI 或 Rewamp UI + beUI + Transitions.dev | Rare UI 偏深色有机展示与非对称 specimen mosaic；Rewamp UI 偏可搜索的单 specimen 工作台；beUI/Transitions 负责连续性与治理 |
| 数据工具 | shadcn/ui + Beautiful UI 或 beUI 的数据展示视角 | 信息层级优先，只有有意义的图表交互才借动效 |
| 微交互打磨 | Bencho 或 Design Spells + 一个源码参考 + Transitions.dev | 先命名触发/反馈，再实现和验收，不把灵感库当依赖 |
| 高影响力营销区块 | Aceternity UI 或 Magic UI + 真实产品媒体 + Transitions.dev | 借一个视觉锚点，保留内容、性能和 fallback |
| React 视觉原语 | Rewamp UI、React Bits 或 Obsidian UI + shadcn/ui | 选一个缺失 job，源码本地化，保留键盘/触摸路径；大量对象优先考虑 Rewamp UI 的索引和预览结构 |

## Translation Checklist

把参考转成实现合同，而不是停在形容词：

```text
Selected lenses:
Borrowed decisions:
Rejected decisions:
Target product object:
Layout and density:
Type and semantic color:
State matrix:
Motion trigger / purpose:
Cleanup:
Reduced-motion behavior:
Static final-state fallback:
Rendered proof:
```

不要复制 logo、品牌身份、整页布局、演示数据或未经确认的资产。参考只改变决策质量，不替代本地项目扫描、真实内容和浏览器渲染验证。
