import { ReactNode } from 'react'

export const MainContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 87px)', // 87 - headers (NavBars) height
      }}
    >
      {children}
    </div>
  )
}
