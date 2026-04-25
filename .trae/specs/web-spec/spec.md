# StoryCanvas AI Web Spec

## Why

为AI绘本生成器提供响应式Web前端，支持PC端和移动端访问，实现用户友好的绘本创作体验。

## What Changes

- 响应式布局（PC/移动端不同样式）
- 用户认证页面（登录/注册）
- 首页（功能展示/导航）
- 故事创作页面（主题输入/参数选择）
- 绘本预览页面（翻页/编辑）
- 我的书架（作品管理）
- 个人中心（用户信息）

## Impact

- 受影响系统: Vue3 + Vite前端项目
- UI框架: Tailwind CSS
- 状态管理: Pinia
- 路由: Vue Router

## ADDED Requirements

### Requirement: 响应式布局

系统 SHALL 根据屏幕宽度自动切换PC端和移动端布局。

#### Scenario: 移动端布局 (< 768px)

- **WHEN** 屏幕宽度 < 768px
- **THEN** 显示移动端优化布局
  - 底部导航栏
  - 单列布局
  - 紧凑间距

#### Scenario: PC端布局 (>= 768px)

- **WHEN** 屏幕宽度 >= 768px
- **THEN** 显示PC端优化布局
  - 顶部导航栏
  - 多列布局
  - 宽松间距

### Requirement: 认证页面

系统 SHALL 提供登录、注册和忘记密码页面。

#### Scenario: 登录页面

- **WHEN** 访问 /auth/login
- **THEN** 显示登录表单
  - 邮箱输入
  - 密码输入（可见性切换）
  - 登录按钮
  - 切换到注册链接
  - 忘记密码链接
  - 微信登录按钮

#### Scenario: 注册页面

- **WHEN** 访问 /auth/register
- **THEN** 显示注册表单
  - 邮箱输入
  - 密码输入
  - 确认密码输入
  - 注册按钮
  - 切换到登录链接
  - 微信注册按钮

#### Scenario: 忘记密码页面

- **WHEN** 访问 /auth/forgot-password
- **THEN** 显示忘记密码表单
  - 邮箱输入
  - 发送验证码按钮
  - 验证码输入
  - 新密码输入
  - 确认新密码输入
  - 重置密码按钮
  - 返回登录链接

### Requirement: Toast 提示组件

系统 SHALL 提供全局 Toast 提示组件用于显示操作反馈。

#### Scenario: 显示成功提示

- **WHEN** 操作成功（如登录成功、注册成功）
- **THEN** 显示绿色 Toast 提示
  - 成功图标
  - 提示消息
  - 自动消失（3秒）

#### Scenario: 显示错误提示

- **WHEN** 操作失败（如登录失败、表单验证错误）
- **THEN** 显示红色 Toast 提示
  - 错误图标
  - 错误消息
  - 自动消失（3秒）

#### Scenario: 显示警告提示

- **WHEN** 需要用户注意（如表单验证警告）
- **THEN** 显示橙色 Toast 提示
  - 警告图标
  - 警告消息
  - 自动消失（3秒）

#### Scenario: 显示信息提示

- **WHEN** 显示一般信息
- **THEN** 显示蓝色 Toast 提示
  - 信息图标
  - 提示消息
  - 自动消失（3秒）

### Requirement: 首页

系统 SHALL 展示产品功能和导航入口。

#### Scenario: 首页展示

- **WHEN** 访问 /
- **THEN** 显示
  - Logo和品牌名称
  - 主标题和副标题
  - 功能特点卡片（多样风格/智能创作/专属书架）
  - 开始创作按钮
  - 底部导航（移动端）

### Requirement: 故事创作页面

系统 SHALL 提供故事参数输入界面。

#### Scenario: 创作表单

- **WHEN** 访问 /create (需要登录)
- **THEN** 显示创作表单
  - 故事主题输入（文本域）
  - 目标年龄段选择（单选）
  - 绘画风格选择（单选）
  - 页数选择（计数器）
  - 开始生成按钮

### Requirement: 绘本预览页面

系统 SHALL 提供绘本预览和编辑功能。

#### Scenario: 预览绘本

- **WHEN** 访问 /preview/:id
- **THEN** 显示
  - 绘本标题
  - 翻页查看（图片+文字）
  - 页面指示器
  - 上一页/下一页按钮
  - 全屏模式

#### Scenario: 编辑页面

- **WHEN** 点击编辑按钮
- **THEN** 显示
  - 文本编辑框
  - 重新生成图片按钮
  - 保存按钮

### Requirement: 我的书架

系统 SHALL 提供作品管理功能。

#### Scenario: 书架列表

- **WHEN** 访问 /bookshelf (需要登录)
- **THEN** 显示
  - 分类标签（全部/已完成/生成中）
  - 作品列表（封面/标题/页数/日期）
  - 删除操作
  - 点击进入预览

### Requirement: 个人中心

系统 SHALL 提供用户信息管理。

#### Scenario: 个人中心

- **WHEN** 访问 /profile (需要登录)
- **THEN** 显示
  - 用户头像
  - 用户昵称
  - 邮箱
  - 编辑资料按钮
  - 退出登录按钮

## MODIFIED Requirements

无

## REMOVED Requirements

无
