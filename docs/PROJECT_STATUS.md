# StoryCanvas AI 项目状态文档

> 生成时间: 2026-04-24
> 用途: 换电脑时恢复项目上下文

---

## 1. 项目概述

**项目名称**: StoryCanvas AI (AI绘本生成器)

**项目描述**: 一个基于AI的绘本故事生成平台，用户输入主题和参数，AI自动生成图文结合的绘本故事。

**项目结构**:
```
StoryCanvas-AI/
├── story-canvas-api/          # Nest.js 后端 API
├── story-canvas-web/          # Vue3 + Vite 前端
├── docs/                      # 项目文档
│   ├── PRD.md                 # 产品需求文档
│   ├── tech-spec.md           # 技术方案
│   ├── development-steps.md   # 开发步骤
│   └── PROJECT_STATUS.md      # 本文件
└── .trae/                     # AI 规则配置
    ├── rules/
    └── specs/
```

---

## 2. 技术栈

### 后端 (story-canvas-api)
- **框架**: Nest.js 11.x
- **数据库**: PostgreSQL + Prisma ORM
- **认证**: JWT + Passport
- **API文档**: Swagger
- **邮件服务**: Nodemailer
- **AI服务**: 可插拔架构 (支持 OpenAI/Anthropic/智谱AI)
- **缓存**: 内存缓存

### 前端 (story-canvas-web)
- **框架**: Vue 3.4.x + Vite 5.x
- **路由**: Vue Router 4.x
- **状态管理**: Pinia 2.x
- **UI框架**: Tailwind CSS 3.4.x
- **HTTP客户端**: Axios

---

## 3. 已完成功能

### 后端 API (完成度: 100%)

#### 认证模块
- [x] POST /api/auth/register - 用户注册
- [x] POST /api/auth/login - 用户登录
- [x] POST /api/auth/logout - 用户登出
- [x] POST /api/auth/send-reset-code - 发送重置验证码
- [x] POST /api/auth/reset-password - 重置密码
- [x] JWT Token 生成和验证
- [x] 密码加密存储 (bcryptjs)
- [x] 邮件服务 (Nodemailer)

#### 用户模块
- [x] GET /api/user/info - 获取用户信息
- [x] PATCH /api/user/info - 更新用户信息

#### 故事模块
- [x] POST /api/stories - 创建故事
- [x] GET /api/stories - 获取故事列表
- [x] GET /api/stories/:id - 获取故事详情
- [x] PATCH /api/stories/:id - 更新故事
- [x] DELETE /api/stories/:id - 删除故事
- [x] POST /api/stories/:id/regenerate - 重新生成页面

#### AI服务模块
- [x] POST /api/ai/generate-text - 生成文本
- [x] POST /api/ai/generate-image - 生成图片
- [x] POST /api/ai/test-provider - 测试AI提供商
- [x] GET /api/ai/health - 健康检查
- [x] GET /api/ai/cache/stats - 缓存统计
- [x] POST /api/ai/cache/clear - 清空缓存

#### 上传模块
- [x] POST /api/upload/token - 获取七牛云上传Token

### 前端页面 (完成度: ~60%)

#### 认证页面
- [x] 登录页面 (/auth/login)
- [x] 注册页面 (/auth/register)
- [x] 忘记密码页面 (/auth/forgot-password)

#### 主要页面
- [x] 首页 (/) - 产品展示
- [ ] 故事创作页 (/create) - 参数输入表单
- [ ] 绘本预览页 (/preview/:id) - 翻页预览
- [ ] 我的书架 (/bookshelf) - 作品管理
- [ ] 个人中心 (/profile) - 用户信息

#### 响应式适配
- [x] 移动端布局 (< 768px)
- [x] PC端布局 (>= 768px)
- [x] 底部导航栏 (移动端)
- [x] 顶部导航栏 (PC端)

---

## 4. 待办事项

### 高优先级
1. **前端页面开发**
   - [ ] 故事创作页 (/create)
   - [ ] 绘本预览页 (/preview/:id)
   - [ ] 我的书架 (/bookshelf)
   - [ ] 个人中心 (/profile)

2. **AI集成测试**
   - [ ] 配置 AI API Key
   - [ ] 测试文本生成
   - [ ] 测试图片生成

3. **文件上传**
   - [ ] 七牛云配置
   - [ ] 头像上传功能

### 中优先级
4. **微信登录**
   - [ ] 微信 OAuth 集成

5. **UI优化**
   - [ ] 加载状态
   - [ ] 错误提示
   - [ ] 动画效果

### 低优先级
6. **部署**
   - [ ] 服务器配置
   - [ ] 域名配置
   - [ ] SSL证书

---

## 5. 环境配置

### 后端 .env 文件
```env
# Database
DATABASE_URL="postgresql://postgres:a630352167@localhost:5432/storycanvas?schema=public"

# JWT
JWT_SECRET="your-super-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"

# AI 服务配置
AI_TEXT_PROVIDER="openai"
AI_IMAGE_PROVIDER="openai"
OPENAI_API_KEY="your-openai-api-key"
OPENAI_MODEL="gpt-4"
OPENAI_BASE_URL="https://api.openai.com/v1"

# 邮件配置 (QQ邮箱)
SMTP_HOST="smtp.qq.com"
SMTP_PORT=587
SMTP_USER="630352167@qq.com"
SMTP_PASS="wntmcxjnlxivbdfh"

# 服务配置
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

### 前端 .env 文件
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## 6. 启动命令

### 后端
```bash
cd story-canvas-api
npm install
npx prisma migrate dev
npm run start:dev
```

### 前端
```bash
cd story-canvas-web
npm install
npm run dev
```

---

## 7. 重要文件位置

### 后端关键文件
- `src/main.ts` - 应用入口
- `src/app.module.ts` - 根模块
- `src/auth/` - 认证模块
- `src/user/` - 用户模块
- `src/story/` - 故事模块
- `src/ai/` - AI服务模块
- `src/mail/` - 邮件服务模块
- `prisma/schema.prisma` - 数据库模型

### 前端关键文件
- `src/main.js` - 应用入口
- `src/App.vue` - 根组件
- `src/router/index.js` - 路由配置
- `src/stores/` - Pinia 状态管理
- `src/views/` - 页面组件
- `src/api/` - API 接口
- `src/components/` - 公共组件

---

## 8. 数据库模型

### User (用户)
- id, email, password, nickname, avatar, createdAt, updatedAt

### Story (故事)
- id, title, theme, ageRange, style, pageCount, coverImage, userId, status, createdAt, updatedAt

### Page (页面)
- id, pageNumber, content, imageUrl, storyId, createdAt, updatedAt

---

## 9. 设计决策记录

1. **响应式方案**: 使用 Tailwind CSS 响应式类，单一代码库适配 PC/移动端
2. **AI架构**: 可插拔设计，支持多提供商切换
3. **认证方式**: JWT + 本地存储
4. **图片存储**: 七牛云 CDN
5. **邮件服务**: QQ邮箱 SMTP

---

## 10. 注意事项

1. **敏感信息**: `.env` 文件包含密码和 API Key，不要提交到 Git
2. **数据库**: 确保 PostgreSQL 服务已启动
3. **AI服务**: 需要配置有效的 API Key 才能使用
4. **邮件服务**: 需要配置正确的 SMTP 授权码

---

## 11. 联系信息

- 项目路径: `c:\Users\63035\Desktop\StoryCanvas-AI`
- 后端端口: 3000
- 前端端口: 5173
- API文档: http://localhost:3000/api/docs

---

*本文档用于项目迁移时快速恢复上下文*
