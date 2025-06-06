import React from 'react'
import './globals.css'
import { Inter, Calistoga } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const calistoga = Calistoga({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-serif',
})

export const metadata = {
  title: 'Elijah DeAngulo - Portfolio',
  description: 'Graduate student and data scientist from Florida. Building AI-powered solutions and scalable data platforms.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body className={`${inter.variable} ${calistoga.variable} min-h-screen bg-background font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
} 