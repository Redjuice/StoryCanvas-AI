# StoryCanvas AI API Spec

## Why
为AI绘本生成器提供完整的RESTful API服务，支持用户认证、故事生成、AI服务调用等核心功能。

## What Changes
- 用户认证模块（注册/登录/JWT）
- 故事管理模块（CRUD/生成/预览）
- AI服务模块（文本生成/图像生成）
- 用户管理模块（信息/更新）
- 文件上传模块（七牛云Token）

## Impact
- 受影响系统: Nest.js后端服务
- 数据库: PostgreSQL + Prisma
- 外部服务: OpenAI/GLM AI API、七牛云存储

## ADDED Requirements

### Requirement: 认证模块
系统 SHALL 提供用户认证功能。

#### Scenario: 用户注册
- **WHEN** POST /api/auth/register
- **BODY** { email, password, nickname }
- **THEN** 创建用户并返回成功消息

#### Scenario: 用户登录
- **WHEN** POST /api/auth/login
- **BODY** { email, password }
- **THEN** 返回 JWT token 和用户信息

#### Scenario: 用户登出
- **WHEN** POST /api/auth/logout
- **THEN** 返回登出成功消息

#### Scenario: 发送重置验证码
- **WHEN** POST /api/auth/send-reset-code
- **BODY** { email }
- **THEN** 发送验证码到用户邮箱

#### Scenario: 重置密码
- **WHEN** POST /api/auth/reset-password
- **BODY** { email, code, newPassword }
- **THEN** 验证验证码并更新密码

### Requirement: 故事模块
系统 SHALL 提供故事/绘本的完整CRUD功能。

#### Scenario: 创建故事
- **WHEN** POST /api/stories (JWT required)
- **BODY** { theme, ageGroup, style, pageCount }
- **THEN** 创建故事并触发AI生成

#### Scenario: 获取故事列表
- **WHEN** GET /api/stories?status= (JWT required)
- **THEN** 返回当前用户的故事列表

#### Scenario: 获取故事详情
- **WHEN** GET /api/stories/:id (JWT required)
- **THEN** 返回故事详情包含所有页面

#### Scenario: 更新故事
- **WHEN** PATCH /api/stories/:id (JWT required)
- **BODY** { title, cover, status }
- **THEN** 更新故事信息

#### Scenario: 删除故事
- **WHEN** DELETE /api/stories/:id (JWT required)
- **THEN** 删除故事及关联页面

#### Scenario: 重新生成页面
- **WHEN** POST /api/stories/:id/regenerate (JWT required)
- **BODY** { pageNum }
- **THEN** 重新生成指定页面的图片

### Requirement: AI服务模块
系统 SHALL 提供AI生成服务。

#### Scenario: 生成文本
- **WHEN** POST /api/ai/generate-text (JWT required)
- **BODY** { prompt, temperature, maxTokens }
- **THEN** 返回AI生成的文本

#### Scenario: 生成图片
- **WHEN** POST /api/ai/generate-image (JWT required)
- **BODY** { prompt, style }
- **THEN** 返回AI生成的图片URL

#### Scenario: 测试AI提供商
- **WHEN** POST /api/ai/test-provider (JWT required)
- **BODY** { provider, prompt, temperature }
- **THEN** 返回指定提供商的测试结果

#### Scenario: 健康检查
- **WHEN** GET /api/ai/health (JWT required)
- **THEN** 返回所有AI提供商的健康状态

### Requirement: 用户模块
系统 SHALL 提供用户信息管理。

#### Scenario: 获取用户信息
- **WHEN** GET /api/user/info (JWT required)
- **THEN** 返回当前用户信息

#### Scenario: 更新用户信息
- **WHEN** PATCH /api/user/info (JWT required)
- **BODY** { nickname, avatar }
- **THEN** 更新用户信息

### Requirement: 上传模块
系统 SHALL 提供文件上传Token生成。

#### Scenario: 获取上传Token
- **WHEN** POST /api/upload/token (JWT required)
- **BODY** { fileName }
- **THEN** 返回七牛云上传Token

## MODIFIED Requirements
无

## REMOVED Requirements
无
