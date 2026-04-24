# API Checklist

## 认证模块
- [x] POST /api/auth/register 用户注册
- [x] POST /api/auth/login 用户登录
- [x] POST /api/auth/logout 用户登出
- [x] JWT Token 生成和验证
- [x] 密码加密存储

## 用户模块
- [x] GET /api/user/info 获取用户信息
- [x] PATCH /api/user/info 更新用户信息

## 故事模块
- [x] POST /api/stories 创建故事
- [x] GET /api/stories 获取故事列表
- [x] GET /api/stories/:id 获取故事详情
- [x] PATCH /api/stories/:id 更新故事
- [x] DELETE /api/stories/:id 删除故事
- [x] POST /api/stories/:id/regenerate 重新生成页面

## AI服务模块
- [x] POST /api/ai/generate-text 生成文本
- [x] POST /api/ai/generate-image 生成图片
- [x] POST /api/ai/test-provider 测试AI提供商
- [x] GET /api/ai/health 健康检查
- [x] GET /api/ai/cache/stats 缓存统计
- [x] POST /api/ai/cache/clear 清空缓存

## 上传模块
- [x] POST /api/upload/token 获取上传Token

## 基础设施
- [x] 全局异常过滤器
- [x] 响应拦截器（统一格式）
- [x] Swagger API文档
- [x] CORS配置
- [x] 请求验证管道
