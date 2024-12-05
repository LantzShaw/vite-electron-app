参考文章: https://segmentfault.com/a/1190000045379977

### 方式一:

```bash
declare global {
  interface Window {
    X: number;
  }
}
```

### 方式二:

```bash
interface Window {
  X: number;
}
```

### 方式三:

```bash
declare global {
  interface Window {
    X: number;
  }
}
```

### 方式四:

```bash
interface Window {
  X: number;
}
```

### 单模块覆盖

```bash
declare const window: {
  X: number;
} & Window;
```
