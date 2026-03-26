/// <reference types="vite/client" />
import.meta.env

declare module '*.svg' {
  const content: string
  export default content
}
declare module '*.png' {
  const content: string
  export default content
}
declare module '*.jpg' {
  const content: string
  export default content
}