import { Toaster } from '@/components/ui/toaster'
import './globals.css'
import type { Metadata } from 'next'
import { Inter, Manrope } from 'next/font/google'
import Head from 'next/head'
import Script from 'next/script'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PQ-CRM',
  description: 'Purple Quarter - Customer relationship management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      
        {children}
        <Toaster />
      </body>
    </html>
  )
}
