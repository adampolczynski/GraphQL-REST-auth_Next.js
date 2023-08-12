import { ReactNode } from 'react'

export const AuthFormCard = ({ children }: { children: ReactNode }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        justifySelf: 'center',
        width: '70rem',
        height: '40rem',
        border: '1px solid grey',
        borderRadius: '2rem',
        margin: 'auto',
        marginTop: '5rem',
        paddingLeft: '2rem',
        paddingRight: '2rem',
      }}
    >
      {children}
    </div>
  )
}
