'use client'

import 'bootstrap/dist/css/bootstrap.min.css'

import { Inter } from 'next/font/google'
import { Navbar } from '../components/navbar'
import { AuthProvider as GraphQLAuthProvider } from '../context/graphql-auth'
import { AuthProvider as RESTAuthProvider } from '../context/basic-auth'
import { MainContainer } from '../components'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <GraphQLAuthProvider>
        <RESTAuthProvider>
          <body className={inter.className}>
            <Navbar />
            <MainContainer>{children}</MainContainer>
          </body>
        </RESTAuthProvider>
      </GraphQLAuthProvider>
    </html>
  )
}
