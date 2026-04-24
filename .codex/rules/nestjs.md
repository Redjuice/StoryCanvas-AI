# NestJS 开发提醒

## 依赖注入
- Provider 不仅要在 `providers` 中，跨模块使用时还要在 `exports` 中暴露
- 循环依赖需要 `forwardRef(() => Module)`
- 默认是单例作用域，避免在 Service 中保存请求态状态

## 模块组织
- 优先导入模块，不直接在别的模块里声明外部 Service
- 共享能力通过 `exports` 暴露
- 仅对真正全局共享的能力使用 `@Global()`

## 校验与 DTO
- 使用 `ValidationPipe`
- 建议启用 `transform: true`
- 建议启用 `whitelist: true`
- 嵌套 DTO 需要 `@ValidateNested()` 和 `@Type(() => XxxDto)`

## 常见坑
- `@Body()` 没有 DTO 时不会自动校验
- `@Param('id')` 默认是字符串，数字请配 `ParseIntPipe`
- 异常要 `throw`，不要 `return`
- 异步调用不要漏掉 `await`
