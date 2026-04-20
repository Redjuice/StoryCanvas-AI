# StoryCanvas-AI 项目规则

## 1. 项目概述
- **项目名称**: StoryCanvas-AI (AI智能绘本创作平台)
- **技术栈**: Vue3 + Vite + Pinia + Vue Router + Axios + Vant
- **端类型**: 单项目响应式布局 (PC + 移动端自适应)

## 2. 开发规范

### 2.1 代码规范
- 使用 Vue3 Composition API (`<script setup>` 语法)
- 使用 TypeScript (若项目需要)
- 使用 ESLint + Prettier 进行代码检查
- 组件命名使用 PascalCase (如: `StoryCard.vue`)
- 工具函数使用 camelCase (如: `useStory生成.ts`)

### 2.2 目录结构
```
src/
├── api/              # API 接口
├── assets/           # 静态资源
├── components/       # 公共组件
│   └── common/       # 通用组件
├── composables/      # 组合式函数
├── hooks/            # 自定义 Hooks
├── layouts/          # 布局组件
├── router/           # 路由配置
├── stores/           # Pinia 状态管理
├── styles/           # 全局样式
├── utils/            # 工具函数
└── views/            # 页面组件
    ├── pc/           # PC端页面
    ├── mobile/       # 移动端页面
    └── common/       # 共用页面
```

### 2.3 响应式适配
- 使用 Vant UI 组件库 (移动端友好)
- 使用 CSS Flex/Grid 布局
- 使用媒体查询 `@media` 进行 PC/移动端样式适配
- 断点: 移动端 < 768px, PC端 >= 768px

### 2.4 注释规范
使用 JSDoc 注释规范:
```javascript
/**
 * 生成故事内容
 * @param {Object} params - 生成参数
 * @param {string} params.theme - 故事主题
 * @param {number} params.age - 目标年龄段
 * @returns {Promise<Object>} 生成的故事对象
 */
```

### 2.5 Git 提交规范
- `feat`: 新功能
- `fix`: Bug修复
- `docs`: 文档更新
- `style`: 样式调整
- `refactor`: 代码重构
- `perf`: 性能优化

## 3. 开发命令
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 代码检查
npm run lint
```

## 4. 环境配置
- 开发环境: `.env.development`
- 生产环境: `.env.production`
- API 基础路径配置在环境变量中
