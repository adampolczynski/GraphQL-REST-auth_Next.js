'use client'

import 'bootstrap/dist/css/bootstrap.min.css'

import { Inter } from 'next/font/google'
import { Navbar } from '../components/navbar'
import { MainContainer } from '../components'
import { AuthProvider } from '@/context/auth'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className}>
          <Navbar />
          <MainContainer>{children}</MainContainer>
        </body>
      </AuthProvider>
    </html>
  )
}
