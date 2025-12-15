import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkSlug from 'remark-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'

const MarkdownRenderer: React.FC<{ body: string; onRendered?: () => void }> = ({ body, onRendered }) => {
  return (
    <div className="markdown-content">
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkSlug]}
      rehypePlugins={[[rehypeAutolinkHeadings, { behavior: 'append' }], rehypeRaw, rehypeSanitize] as any}
      components={{
        img: ({ node, ...props }) => (
          // Constrain and lazy-load images for performance
          <img loading="lazy" decoding="async" style={{ maxWidth: '100%', height: 'auto' }} {...props as any} />
          ),
          h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-6 mb-4 text-gray-900" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-5 mb-3 text-gray-900" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-900" {...props} />,
          h4: ({ node, ...props }) => <h4 className="text-lg font-semibold mt-3 mb-2 text-gray-900" {...props} />,
          h5: ({ node, ...props }) => <h5 className="text-base font-semibold mt-3 mb-2 text-gray-900" {...props} />,
          h6: ({ node, ...props }) => <h6 className="text-sm font-semibold mt-2 mb-2 text-gray-900" {...props} />,
          p: ({ node, ...props }) => <p className="mb-4 text-gray-700 leading-relaxed" {...props} />,
          a: ({ node, ...props }) => <a className="text-blue-600 underline hover:text-blue-800 transition-colors" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700" {...props} />,
          li: ({ node, ...props }) => <li className="ml-4" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900" {...props} />,
          em: ({ node, ...props }) => <em className="italic" {...props} />,
          code: ({ node, inline, ...props }: any) => 
            inline ? (
              <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
            ) : (
              <code className="block bg-gray-100 text-gray-800 p-4 rounded-lg text-sm font-mono overflow-x-auto mb-4" {...props} />
            ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4" {...props} />
          ),
      }}
    >
      {body}
    </ReactMarkdown>
    </div>
  )
}

export default MarkdownRenderer

