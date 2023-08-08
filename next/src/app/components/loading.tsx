export const Loading = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '50rem',
      }}
    >
      <div className="spinner-border" role="status" style={{ width: '5rem', height: '5rem' }} />
    </div>
  )
}
