# Vue 3 开发规范

## Composition API 哲学
- Composition API 是为了更好的代码组织，而非替代 Options API
- 按功能分组代码，而非按选项类型——相关逻辑放在一起
- 将可复用逻辑提取到 composables——Composition API 的主要优势
- `<script setup>` 是推荐语法——更简洁、性能更好

## 响应式陷阱
- `ref` 用于原始类型——脚本中用 `.value` 访问，模板中自动解包
- `reactive` 不能重新赋值整个对象——`state = {...}` 会破坏响应式
- 解构 `reactive` 会丢失响应式——使用 `toRefs(state)` 保留
- Vue 3 中数组索引赋值是响应式的——`arr[0] = x` 可以工作
- 嵌套的 ref 在 reactive 中会自动解包——`reactive({count: ref(0)}).count` 是数字，不是 ref

## Watch vs Computed
- `computed` 用于派生状态——缓存，仅在依赖变化时重新计算
- `watch` 用于副作用——当需要在变化时执行操作
- `computed` 应该是纯函数——无副作用，无异步
- `watchEffect` 用于立即响应并自动追踪依赖

## Watch 陷阱
- 监听 reactive 对象需要 `deep: true`——或监听 getter 函数
- `watch` 默认是惰性的——使用 `immediate: true` 立即执行
- Watch 回调接收新旧值——`watch(source, (newVal, oldVal) => {})`
- `watchEffect` 无法访问旧值——需要比较新旧值时用 `watch`
- 用返回的函数停止监听——`const stop = watch(...); stop()`

## Props 和 Emits 陷阱
- `defineProps` 实现类型安全的 props——`defineProps<{ msg: string }>()`
- Props 是只读的——不要修改，向父组件发送事件
- `defineEmits` 实现类型安全的事件——`defineEmits<{ (e: 'update', val: string): void }>()`
- `v-model` 是 `:modelValue` + `@update:modelValue`——自定义 v-model 使用 `defineModel()`
- 对象的默认值必须是工厂函数——`default: () => ({})`

## Template Ref 陷阱
- `ref="name"` + `const name = ref(null)`——名称必须完全匹配
- 模板 ref 在挂载后可用——在 `onMounted` 中访问，而非 setup 期间
- 组件上的 `ref` 获取组件实例——元素上的 `ref` 获取 DOM 元素
- `v-for` 中的模板 ref 变成 ref 数组

## 生命周期陷阱
- `onMounted` 用于 DOM 访问——组件已挂载到 DOM
- `onUnmounted` 用于清理——订阅、定时器、事件监听器
- `onBeforeMount` 在 DOM 插入前运行——很少需要但存在
- 生命周期钩子必须在 setup 中同步调用——不能在回调或条件语句中
- 异步 setup 需要 `<Suspense>` 包装

## Provide/Inject 陷阱
- 父组件 `provide('key', value)`——后代组件 `inject('key')`
- 如果值是 ref/reactive 则为响应式——否则是静态快照
- 默认值：`inject('key', defaultVal)`——第三个参数为工厂函数
- 使用 Symbol 键保证类型安全——避免字符串键冲突

## Vue Router 陷阱
- `useRoute` 获取当前路由——响应式的，在 setup 中使用
- `useRouter` 用于导航——`router.push('/path')`
- 导航守卫：`beforeEach`、`beforeResolve`、`afterEach`——返回 `false` 取消导航
- `<RouterView>` 支持命名视图——每个路由多个视图

## 常见错误
- `v-if` vs `v-show`——v-if 从 DOM 移除，v-show 切换 display
- `v-for` 必须有 key——`v-for="item in items" :key="item.id"`
- 事件修饰符顺序有影响——`.prevent.stop` vs `.stop.prevent`
- 使用 Teleport 处理模态框——`<Teleport to="body">` 在组件树外渲染
