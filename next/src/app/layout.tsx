'use client'

import 'bootstrap/dist/css/bootstrap.min.css'

import { Inter } from 'next/font/google'
import { Navbar } from './components/navbar'
import { AuthProvider as GraphQLAuthProvider } from './context/apollo-auth'
import { AuthProvider as RESTAuthProvider } from './context/auth'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <GraphQLAuthProvider>
        <RESTAuthProvider>
          <body className={inter.className}>
            <Navbar />
            {children}
          </body>
        </RESTAuthProvider>
      </GraphQLAuthProvider>
    </html>
  )
}
