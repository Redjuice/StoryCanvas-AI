# Vue 3 开发提醒

## 基本原则
- 以 Composition API 和 `<script setup>` 为主
- 按功能组织代码，抽离可复用 composables
- 保持组件职责单一，状态和副作用分离

## 响应式注意点
- 原始值用 `ref`
- 对象用 `reactive` 时不要整体重赋值
- 解构 `reactive` 前先用 `toRefs`
- `computed` 用于派生状态，`watch` 用于副作用

## 组件与交互
- Props 只读，不直接修改
- 事件使用 `defineEmits`
- 自定义双向绑定优先遵循 `v-model` 约定
- DOM 或组件实例的 `ref` 在 `onMounted` 后再访问

## 常见坑
- `watch` 默认不会立即执行，需要时加 `immediate: true`
- 监听复杂对象时注意深度监听
- `v-for` 必须提供稳定 `key`
- `v-if` 和 `v-show` 语义不同，按场景选择
