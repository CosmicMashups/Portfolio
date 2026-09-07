import faviconUrl from './assets/cosmicmashups.jpg'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/design-system.css'
import 'lenis/dist/lenis.css'
import './index.css'
import App from './App.tsx'

const faviconLink = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
if (faviconLink) {
  faviconLink.type = 'image/jpeg'
  faviconLink.href = faviconUrl
} else {
  const el = document.createElement('link')
  el.rel = 'icon'
  el.type = 'image/jpeg'
  el.href = faviconUrl
  document.head.appendChild(el)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
