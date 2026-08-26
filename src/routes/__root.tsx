import { ReactNode } from 'react'
import { RootDocument } from '@tanstack/start'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <RootDocument>
      <html>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Snippet Studio</title>
        </head>
        <body className="bg-white text-gray-900">
          {children}
        </body>
      </html>
    </RootDocument>
  )
}
