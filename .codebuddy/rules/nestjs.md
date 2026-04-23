# NestJS 开发规范

## 依赖注入
- Provider 不可用时——必须在 `providers` 数组中，如果其他模块使用还需在 `exports` 中
- 循环依赖崩溃——在两个模块中都使用 `forwardRef(() => Module)`
- 默认作用域是单例——同一实例跨请求，注意状态管理
- 请求作用域的 provider——`@Injectable({ scope: Scope.REQUEST })`，会传播到依赖项

## 模块组织
- 导入模块，而非直接导入 provider——`imports: [UserModule]` 而非 `providers: [UserService]`
- `exports` 使 provider 对导入者可用——没有它，provider 保持私有
- 全局模块需要 `@Global()` 装饰器——仅用于真正共享的（config、logger）
- `forRoot()` vs `forRootAsync()`——当配置依赖其他 provider 时使用 async

## 验证
- `ValidationPipe` 需要 `class-validator` 装饰器——普通类不会验证
- 启用 `transform: true` 自动转换——字符串 `"1"` 变为数字 `1`
- `whitelist: true` 剥离未知属性——`forbidNonWhitelisted: true` 改为报错
- 嵌套对象需要 `@ValidateNested()` 和 `@Type(() => NestedDto)`——两者都必须

## 执行顺序
- Middleware → Guards → Interceptors (pre) → Pipes → Handler → Interceptors (post) → Filters
- Guards 无法访问已转换的 body——在 pipes 之前运行
- 全局 pipes 在路由 pipes 之前运行——但在 guards 之后
- 异常过滤器捕获整个链中的错误——包括 guards 和 pipes

## 异常处理
- `throw new HttpException()` 而非 `return`——必须 throw 才能被过滤器捕获
- 自定义异常继承 `HttpException`——或实现 `ExceptionFilter`
- 未处理的异常变为 500——用 try/catch 包装外部调用
- 内置异常：`BadRequestException`、`NotFoundException` 等——使用这些，而非通用 HttpException

## 测试
- `createTestingModule` 不会自动 mock——在 `providers` 中显式提供 mock
- 用 `.overrideProvider(X).useValue(mock)` 覆盖——在 `.compile()` 之前
- E2E 测试需要 `app.init()`——以及 afterAll 中的 `app.close()`
- 请求作用域的 provider 使单元测试复杂化——尽可能使用单例

## 常见错误
- `@Body()` 没有 DTO 返回普通对象——无验证、无转换
- `@Param('id')` 总是字符串——使用 `ParseIntPipe` 获取数字：`@Param('id', ParseIntPipe)`
- Guards 返回 false 给出 403——抛出特定异常以获得更好的错误消息
- 异步 provider 需要工厂——`useFactory: async () => await createConnection()`
- 忘记 await 异步 service 方法——返回 Promise，而非值
