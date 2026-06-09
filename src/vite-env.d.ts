/// <reference types="vite/client" />

declare module 'react-resizable-panels' {
  export const Panel: import('react').ComponentType<{
    defaultSize?: number
    minSize?: number
    maxSize?: number
    children: import('react').ReactNode
    className?: string
    style?: import('react').CSSProperties
  }>

  export const PanelGroup: import('react').ComponentType<{
    direction: 'horizontal' | 'vertical'
    children: import('react').ReactNode
    className?: string
  }>

  export const PanelResizeHandle: import('react').ComponentType<{
    children?: import('react').ReactNode
    className?: string
  }>
}
