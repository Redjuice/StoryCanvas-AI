# StoryCanvas-API 代码运行流程图

## 1. 应用启动流程

```mermaid
flowchart TD
    A[main.ts] --> B[NestFactory.create]
    B --> C[创建应用实例]
    C --> D[ValidationPipe 配置]
    D --> E[CORS 配置]
    E --> F[全局路由前缀 /api]
    F --> G[启动 HTTP 服务器]
    G --> H[监听端口 3000]
    
    style A fill:#e1f5fe
    style H fill:#c8e6c9
```

## 2. 模块依赖关系

```mermaid
flowchart TD
    A[AppModule] --> B[ConfigModule]
    A --> C[PrismaModule]
    A --> D[AuthModule]
    A --> E[AppController]
    A --> F[AppService]
    
    C --> G[PrismaService]
    
    D --> H[AuthController]
    D --> I[AuthService]
    D --> J[JwtStrategy]
    D --> K[JwtAuthGuard]
    
    I --> G
    J --> G
    
    style A fill:#fff3e0
    style C fill:#e8f5e9
    style D fill:#f3e5f5
```

## 3. 请求处理流程（以登录为例）

```mermaid
sequenceDiagram
    participant Client as 前端客户端
    participant Main as main.ts
    participant Guard as JwtAuthGuard
    participant Controller as AuthController
    participant Service as AuthService
    participant Prisma as PrismaService
    participant DB as PostgreSQL

    Client->>Main: POST /api/auth/login
    Main->>Main: ValidationPipe 验证 DTO
    Main->>Guard: 验证 JWT Token
    Guard-->>Main: Token 有效
    Main->>Controller: 调用 login 方法
    
    Controller->>Service: login(loginDto)
    Service->>Prisma: 查询用户
    Prisma->>DB: SELECT * FROM users WHERE email = ?
    DB-->>Prisma: 返回用户数据
    Prisma-->>Service: 用户对象
    
    Service->>Service: bcrypt.compare 验证密码
    Service->>Service: jwtService.sign 生成 Token
    Service-->>Controller: { token, user }
    Controller-->>Main: 响应 JSON
    Main-->>Client: HTTP 200 + JWT Token
```

## 4. 注册流程

```mermaid
flowchart TD
    A[POST /api/auth/register] --> B{验证邮箱格式}
    B -->|无效| C[返回 400 错误]
    B -->|有效| D{查询数据库}
    
    D --> E{用户已存在?}
    E -->|是| F[返回 409 Conflict<br/>'邮箱已被注册']
    E -->|否| G[bcrypt.hash 加密密码]
    
    G --> H[Prisma 创建用户]
    H --> I[数据库 INSERT]
    I --> J[JWT 生成 Token]
    J --> K[返回 201 + {token, user}]
    
    style A fill:#e3f2fd
    style K fill:#c8e6c9
```

## 5. 认证流程

```mermaid
flowchart TD
    A[受保护的路由] --> B{包含 JWT Token?}
    
    B -->|否| C[返回 401 Unauthorized]
    B -->|是| D[JwtStrategy validate]
    
    D --> E{Token 有效?}
    E -->|否| F[返回 401 Unauthorized]
    E -->|是| G[查询数据库用户]
    
    G --> H{用户存在?}
    H -->|否| I[返回 401 Unauthorized]
    H -->|是| J[将用户信息挂载到 Request]
    J --> K[执行业务逻辑]
    
    style A fill:#fff3e0
    style K fill:#c8e6c9
```

## 6. 项目文件结构

```
story-canvas-api/
├── src/
│   ├── main.ts                 # 应用入口
│   ├── app.module.ts           # 根模块
│   ├── app.controller.ts       # 根控制器
│   ├── app.service.ts          # 根服务
│   │
│   ├── auth/                   # 认证模块
│   │   ├── auth.module.ts      # 认证模块定义
│   │   ├── auth.controller.ts  # 处理认证请求
│   │   ├── auth.service.ts     # 认证业务逻辑
│   │   ├── dto/                # 数据传输对象
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   ├── strategies/          # Passport 策略
│   │   │   └── jwt.strategy.ts # JWT 验证策略
│   │   └── guards/              # 守卫
│   │       └── jwt-auth.guard.ts
│   │
│   └── prisma/                 # 数据库模块
│       ├── prisma.module.ts
│       └── prisma.service.ts   # Prisma 客户端
│
├── prisma/
│   └── schema.prisma           # 数据库模型
│
└── .env                        # 环境变量
```

## 7. 中间件与管道

```mermaid
flowchart LR
    A[客户端请求] --> B[Global Prefix /api]
    B --> C[ValidationPipe]
    C --> D{DTO 验证通过?}
    D -->|否| E[返回 400 错误]
    D -->|是| F[JwtAuthGuard]
    F --> G{Token 有效?}
    G -->|否| H[返回 401 错误]
    G -->|是| I[Controller]
    I --> J[Service]
    J --> K[Prisma]
    K --> L[PostgreSQL]
    L --> K
    K --> J
    J --> I
    I --> M[响应客户端]
    
    style C fill:#fff9c4
    style F fill:#fff9c4
```

## 8. 数据流向

```
请求入口 (main.ts)
       │
       ▼
┌──────────────────┐
│  ValidationPipe  │  ← DTO 验证
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   CORS 中间件    │  ← 跨域资源共享
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Global Prefix   │  ← /api 路由前缀
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Auth Guard      │  ← JWT 认证（可选）
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Controller     │  ← 请求路由处理
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│    Service       │  ← 业务逻辑处理
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Prisma Client   │  ← 数据库操作
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   PostgreSQL     │  ← 数据持久化
└──────────────────┘
```

## 9. 关键配置说明

| 配置项 | 文件位置 | 说明 |
|--------|----------|------|
| 端口 | .env → PORT | 默认 3000 |
| JWT 密钥 | .env → JWT_SECRET | 生产环境必须修改 |
| JWT 过期时间 | auth.service.ts | 24小时 |
| 数据库 URL | .env → DATABASE_URL | PostgreSQL 连接串 |
| 前端地址 | .env → FRONTEND_URL | CORS 白名单 |

---

**文档版本：** 1.0  
**最后更新：** 2026-04-20
