import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

interface CodeBlockProps {
  code: string
  language: string
  filename?: string
}

export function CodeBlock({ code, language, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [flash, setFlash] = useState(false)

  const onCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setFlash(true)
    window.setTimeout(() => setFlash(false), 450)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="overflow-hidden rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)]"
      style={{ boxShadow: flash ? '0 0 0 1px var(--color-accent-primary)' : undefined }}
    >
      {filename ? (
        <div className="flex items-center gap-2 border-b border-[var(--color-border-subtle)] px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#F87171]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FBBF24]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#34D399]" />
          <span className="ml-2 text-xs text-[var(--color-text-muted)]">{filename}</span>
          <button
            type="button"
            onClick={onCopy}
            className="ml-auto inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors"
            style={{ background: copied ? 'var(--color-accent-primary-dim)' : 'transparent' }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      ) : null}
      <SyntaxHighlighter
        language={language}
        customStyle={{
          margin: 0,
          background: 'var(--color-bg-elevated)',
          fontSize: '0.85rem',
        }}
        style={
          {
            'code[class*="language-"]': { color: 'var(--color-text-primary)' },
            keyword: { color: 'var(--color-accent-secondary)' },
            string: { color: 'var(--color-accent-primary)' },
            comment: { color: 'var(--color-text-muted)' },
          } as never
        }
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
