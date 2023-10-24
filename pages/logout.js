const Logout = () => {
  setTimeout(() => {
    const link = document.createElement('a')
    link.href = '/'
    link.click()
  }, 3000)

  return (
    <>
      <div style={{ fontSize: '3rem', textAlign: 'center' }}>thank you</div>
      <div style={{ fontSize: '1.2rem', textAlign: 'center' }}>you have successfully logout</div>
    </>
  )
}

export default Logout