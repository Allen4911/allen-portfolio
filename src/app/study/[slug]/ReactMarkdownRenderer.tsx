'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'

export default function ReactMarkdownRenderer({ content }) {
  return (
    <div className="markdown-body" style={{ colorScheme: 'light', color: '#1d1d1f' }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeSlug]}
        components={{
          h1: ({ children }) => (
            <h1
              style={{
                fontSize: '34px',
                fontWeight: '600',
                lineHeight: '1.47',
                letterSpacing: '-0.374px',
                color: '#1d1d1f',
                marginBottom: '20px',
                marginTop: '40px',
              }}
            >
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2
              style={{
                fontSize: '28px',
                fontWeight: '600',
                lineHeight: '1.14',
                letterSpacing: '-0.28px',
                color: '#1d1d1f',
                marginBottom: '16px',
                marginTop: '36px',
              }}
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              style={{
                fontSize: '21px',
                fontWeight: '600',
                lineHeight: '1.19',
                letterSpacing: '0.231px',
                color: '#1d1d1f',
                marginBottom: '12px',
                marginTop: '28px',
              }}
            >
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p
              style={{
                fontSize: '17px',
                fontWeight: '400',
                lineHeight: '1.47',
                letterSpacing: '-0.374px',
                color: '#1d1d1f',
                marginBottom: '16px',
              }}
            >
              {children}
            </p>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              style={{ color: '#0066cc', textDecoration: 'underline' }}
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),
          code: ({ className, children }) => {
            const isInline = !className && !String(children).includes('\n')
            if (isInline) {
              return (
                <code
                  style={{
                    backgroundColor: '#f5f5f7',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontFamily: 'Menlo, Consolas, "Courier New", monospace',
                    color: '#0066cc',
                  }}
                >
                  {children}
                </code>
              )
            }
            return (
              <code className={className} style={{ fontFamily: 'Menlo, Consolas, "Courier New", monospace', color: '#cdd6f4', fontSize: '14px' }}>
                {children}
              </code>
            )
          },
          pre: ({ children }) => (
            <pre
              style={{
                backgroundColor: '#1e1e2e',
                borderRadius: '8px',
                padding: '20px',
                overflow: 'auto',
                marginBottom: '24px',
                marginTop: '8px',
                fontFamily: 'Menlo, Consolas, "Courier New", monospace',
                whiteSpace: 'pre',
                lineHeight: 1.6,
                letterSpacing: '0px',
                fontSize: '14px',
              }}
            >
              {children}
            </pre>
          ),
          ul: ({ children }) => (
            <ul
              style={{
                paddingLeft: '24px',
                marginBottom: '16px',
                listStyleType: 'disc',
              }}
            >
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol
              style={{
                paddingLeft: '24px',
                marginBottom: '16px',
                listStyleType: 'decimal',
              }}
            >
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li
              style={{
                fontSize: '17px',
                lineHeight: '1.47',
                letterSpacing: '-0.374px',
                color: '#1d1d1f',
                marginBottom: '4px',
              }}
            >
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote
              style={{
                borderLeft: '3px solid #0066cc',
                paddingLeft: '20px',
                marginLeft: '0',
                marginBottom: '16px',
                color: '#7a7a7a',
              }}
            >
              {children}
            </blockquote>
          ),
          strong: ({ children }) => (
            <strong style={{ fontWeight: '600', color: '#1d1d1f' }}>{children}</strong>
          ),
          hr: () => (
            <hr
              style={{
                border: 'none',
                borderTop: '1px solid #e0e0e0',
                margin: '32px 0',
              }}
            />
          ),
          table: ({ children }) => (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', marginTop: '8px', fontSize: '15px', lineHeight: '1.47' }}>
              {children}
            </table>
          ),
          thead: ({ children }) => (
            <thead style={{ backgroundColor: '#f5f5f7' }}>{children}</thead>
          ),
          th: ({ children }) => (
            <th style={{ border: '1px solid #e0e0e0', padding: '10px 14px', fontWeight: '600', textAlign: 'left', color: '#1d1d1f' }}>{children}</th>
          ),
          td: ({ children }) => (
            <td style={{ border: '1px solid #e0e0e0', padding: '10px 14px', color: '#1d1d1f' }}>{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
