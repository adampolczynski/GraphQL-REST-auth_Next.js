import { ReactNode } from 'react'

export const MainContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '90%',
        margin: 'auto',
        marginTop: '3rem',
      }}
    >
      {children}
    </div>
  )
}
