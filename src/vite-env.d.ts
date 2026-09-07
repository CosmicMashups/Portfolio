/// <reference types="vite/client" />

declare module '*.md?raw' {
  const content: string
  export default content
}

declare module '*.pdf' {
  const src: string
  export default src
}

declare module '*.glb' {
  const src: string
  export default src
}
