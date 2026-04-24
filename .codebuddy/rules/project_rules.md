# StoryCanvas-AI 项目规则

## 1. 项目概述
- **项目名称**: StoryCanvas-AI (AI智能绘本创作平台)
- **前端技术栈**: Vue3 + Vite + Pinia + Vue Router + Axios + Tailwind CSS
- **后端技术栈**: Nest.js + PostgreSQL + Prisma + JWT
- **端类型**: 单项目响应式布局 (PC + 移动端自适应)

---

## 2. 前端开发规范

### 2.1 代码规范
- 使用 Vue3 Composition API (`<script setup>` 语法)
- 使用 TypeScript (若项目需要)
- 使用 ESLint + Prettier 进行代码检查
- 组件命名使用 PascalCase (如: `StoryCard.vue`)
- 工具函数使用 camelCase (如: `useStory生成.ts`)

### 2.2 目录结构
```
story-canvas-web/ (前端项目)
├── public/                  # 静态资源
├── src/
│   ├── api/                 # API 接口封装
│   │   ├── index.js         # Axios 实例
│   │   ├── auth.js          # 认证相关 API
│   │   └── story.js         # 故事相关 API
│   ├── assets/              # 静态资源
│   ├── components/          # 公共组件
│   │   ├── common/          # 通用组件
│   │   └── layout/          # 布局组件
│   ├── composables/         # 组合式函数
│   ├── router/              # 路由配置
│   ├── stores/              # Pinia 状态管理
│   ├── utils/               # 工具函数
│   └── views/               # 页面组件
```

### 2.3 响应式适配
- 使用 Tailwind CSS (自行实现UI组件，响应式适配)
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

---

## 3. 后端开发规范

### 3.1 代码规范
- 使用 Nest.js 模块化架构
- 使用 TypeScript
- 使用 Prisma ORM 进行数据库操作
- Service 层使用类方法，不使用箭头函数
- Controller 负责路由和参数校验，业务逻辑在 Service 层

### 3.2 目录结构
```
story-canvas-api/ (后端项目)
├── src/
│   ├── auth/                 # 认证模块
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   └── dto/
│   │       ├── login.dto.ts
│   │       └── register.dto.ts
│   ├── users/                # 用户模块
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   └── dto/
│   ├── stories/              # 故事模块
│   │   ├── stories.controller.ts
│   │   ├── stories.service.ts
│   │   ├── stories.module.ts
│   │   └── dto/
│   ├── ai/                   # AI 服务模块
│   │   ├── ai.service.ts
│   │   ├── ai.module.ts
│   │   └── providers/
│   │       ├── text-generator.provider.ts
│   │       └── image-generator.provider.ts
│   ├── upload/               # 文件上传模块
│   ├── prisma/               # Prisma 配置
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   ├── common/               # 公共模块
│   │   ├── decorators/
│   │   │   └── current-user.decorator.ts
│   │   ├── interceptors/
│   │   │   └── transform.interceptor.ts
│   │   └── filters/
│   │       └── http-exception.filter.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   └── schema.prisma         # 数据库 Schema
├── .env                      # 环境变量
└── package.json
```

### 3.3 数据库模型
```prisma
# User - 用户模型
# Story - 故事模型 (含状态: DRAFT, GENERATING, COMPLETED, FAILED)
# Page - 页面模型
```

### 3.4 API 接口规范
| 模块 | 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|------|
| 认证 | POST | /api/auth/register | 用户注册 | 否 |
| 认证 | POST | /api/auth/login | 用户登录 | 否 |
| 认证 | POST | /api/auth/logout | 用户登出 | 是 |
| 用户 | GET | /api/user/info | 获取用户信息 | 是 |
| 用户 | PATCH | /api/user/info | 更新用户信息 | 是 |
| 故事 | POST | /api/stories | 创建故事 | 是 |
| 故事 | GET | /api/stories | 获取故事列表 | 是 |
| 故事 | GET | /api/stories/:id | 获取故事详情 | 是 |
| 故事 | PATCH | /api/stories/:id | 更新故事 | 是 |
| 故事 | DELETE | /api/stories/:id | 删除故事 | 是 |
| 故事 | POST | /api/stories/:id/regenerate | 重新生成页面 | 是 |

---

## 4. Git 提交规范
- `feat`: 新功能
- `fix`: Bug修复
- `docs`: 文档更新
- `style`: 样式调整
- `refactor`: 代码重构
- `perf`: 性能优化

---

## 5. 前端开发命令
```bash
# 进入前端目录
cd story-canvas-web

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 代码检查
npm run lint
```

## 6. 后端开发命令
```bash
# 进入后端目录
cd story-canvas-api

# 安装依赖
npm install

# 生成 Prisma Client
npx prisma generate

# 执行数据库迁移
npx prisma migrate dev --name init

# 启动开发服务器
npm run start:dev

# 构建生产版本
npm run build

# 运行测试
npm run test
```

---

## 7. 环境配置

### 前端环境变量
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE=AI绘本生成器
```

### 后端环境变量
```env
# 数据库
DATABASE_URL="postgresql://user:password@localhost:5432/storycanvas?schema=public"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# AI 服务
OPENAI_API_KEY="your-openai-api-key"
OPENAI_MODEL="gpt-4"

# 服务配置
PORT=3000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

---

## 8. 项目结构总览
```
StoryCanvas-AI/
├── story-canvas-web/         # 前端项目 (Vue3)
├── story-canvas-api/         # 后端项目 (Nest.js)
├── docs/                     # 项目文档
│   ├── PRD.md
│   ├── 技术方案.md
│   └── 后端开发步骤.md
├── .trae/
│   └── project_rules.md
└── README.md
```
