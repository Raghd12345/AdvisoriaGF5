import type { Metadata } from 'next'
import './globals.css'
import ChatWidget from '../components/ChatWidget'

export const metadata: Metadata = {
  title: 'Advisoria',
  description: 'AI-powered marketing assistance for small businesses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <nav className="glass fixed top-0 left-0 right-0 z-40 border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-white">🚀 Advisoria</h1>
              </div>
              <div className="flex items-center space-x-6">
                <a href="/campaign/new" className="text-white/80 hover:text-white transition-colors hover:scale-105 transform duration-200">New Campaign</a>
                <a href="/competition" className="text-white/80 hover:text-white transition-colors hover:scale-105 transform duration-200">Competitors</a>
                <a href="/chat" className="text-white/80 hover:text-white transition-colors hover:scale-105 transform duration-200">Chat</a>
              </div>
            </div>
          </div>
        </nav>
        <main className="pt-16">
          {children}
        </main>
        <ChatWidget />
      </body>
    </html>
  )
}