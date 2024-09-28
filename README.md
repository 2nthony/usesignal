# UseSignal

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

Collection of Essential React Hooks with [Signals](https://github.com/preactjs/signals/tree/main/packages/react). Basically a **FORK** of [VueUse](https://vueuse.org/).

## Docs & Demos

[UseSignal](https://usesignal.vercel.app/), but you can ref to [VueUse](https://vueuse.org/functions.html) directly, all currently supported functions usage basically the same.

## Install

```sh
pnpm add @preact/signals-react @usesignal/core
```

## Usage

```ts
import { useLocalStorage, useMouse, usePreferredDark } from '@usesignal/core'

export function useCustomHook() {
  // tracks mouse position
  const { x, y } = useMouse()

  // if user prefers dark theme
  const isDark = usePreferredDark()

  // persist state in localStorage
  const store = useLocalStorage(
    'my-storage',
    {
      name: 'Apple',
      color: 'red',
    },
  )

  return { x, y, isDark, store }
}
```

## Enhancements

### `signal`=`useSignal`

Proxy `Signal` to support `useRef`.

```tsx
import { useSignal } from '@usesignal/core'

export default function App() {
  const el = useSignal()
  const input = useSignal('Hello World')

  console.log(el.value) // div

  return (
    <div ref={el}>
      <input defaultValue={input.value} />
    </div>
  )
}
```

### `computed`=`useComputed`

Proxy `ReadonlySignal` to `ComputedSignal`, support `get` and `set`.

```ts
import { useComputed } from '@usesignal/core'

export default function App() {
  const count = useSignal(0)
  // readonly
  const computed = useComputed(() => count.value * 2)
  // getter & setter
  const computed2 = useComputed({
    get() {
      return count.value * 2
    },
    set(value) {
      count.value = value / 2
    },
  })
}
```

## Playground

- [Demo(next.js)](https://usesignal.vercel.app/)
- [Next.js(shadcn/ui(stackblitz))](https://stackblitz.com/edit/stackblitz-starters-xvtr12?description=The%20React%20framework%20for%20production&file=app/page.tsx&title=Next.js%20Starter)
- [remix-run(stackblitz)](https://stackblitz.com/edit/remix-run-remix-6gxayd?file=app/routes/_index.tsx)

## License

[MIT](./LICENSE) License © 2024-PRESENT [2nthony](https://github.com/2nthony)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@usesignal/core?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/@usesignal/core
[npm-downloads-src]: https://img.shields.io/npm/dm/@usesignal/core?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/@usesignal/core
[bundle-src]: https://img.shields.io/bundlephobia/minzip/@usesignal/core?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=@usesignal/core
[license-src]: https://img.shields.io/github/license/2nthony/usesignal.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/2nthony/usesignal/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/@usesignal/core
