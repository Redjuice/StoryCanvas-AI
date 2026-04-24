# StoryCanvas-AI 项目规则

## 1. 项目概述
- **项目名称**: StoryCanvas-AI (AI智能绘本创作平台)
- **前端技术栈**: Vue3 + Vite + Pinia + Vue Router + Axios + Tailwind CSS
- **后端技术栈**: Nest.js + PostgreSQL + Prisma + JWT
- **端类型**: 单项目响应式布局 (PC + 移动端自适应)

## 2. 前端开发规范

### 2.1 代码规范
- 使用 Vue3 Composition API (`<script setup>` 语法)
- 使用 TypeScript（若项目需要）
- 使用 ESLint + Prettier 进行代码检查
- 组件命名使用 PascalCase（如：`StoryCard.vue`）
- 工具函数使用 camelCase（如：`useStoryGenerator.ts`）

### 2.2 目录结构
```text
story-canvas-web/
├── public/
├── src/
│   ├── api/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   └── layout/
│   ├── composables/
│   ├── router/
│   ├── stores/
│   ├── utils/
│   └── views/
```

### 2.3 响应式适配
- 使用 Tailwind CSS 完成响应式适配
- 使用 Flex/Grid 布局
- 断点：移动端 `< 768px`，PC 端 `>= 768px`

### 2.4 注释规范
- 推荐关键函数使用 JSDoc 注释

## 3. 后端开发规范

### 3.1 代码规范
- 使用 Nest.js 模块化架构
- 使用 TypeScript
- 使用 Prisma ORM 操作数据库
- Service 层使用类方法，不使用箭头函数
- Controller 负责路由和参数校验，业务逻辑在 Service 层

### 3.2 目录结构
```text
story-canvas-api/
├── src/
│   ├── auth/
│   ├── users/
│   ├── stories/
│   ├── ai/
│   ├── upload/
│   ├── prisma/
│   ├── common/
│   ├── app.controller.ts
│   ├── app.service.ts
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   └── schema.prisma
└── package.json
```

### 3.3 API 规范
- 认证模块：注册、登录、登出
- 用户模块：获取和更新用户信息
- 故事模块：创建、查询、更新、删除、重新生成

## 4. Git 提交规范
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 样式调整
- `refactor`: 代码重构
- `perf`: 性能优化

## 5. 常用命令

### 前端
```bash
cd story-canvas-web
npm install
npm run dev
npm run build
npm run lint
```

### 后端
```bash
cd story-canvas-api
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
npm run build
npm run test
```

## 6. 环境变量

### 前端
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE=AI绘本生成器
```

### 后端
```env
DATABASE_URL="postgresql://user:password@localhost:5432/storycanvas?schema=public"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
OPENAI_API_KEY="your-openai-api-key"
OPENAI_MODEL="gpt-4"
PORT=3000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```
