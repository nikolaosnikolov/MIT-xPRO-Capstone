import { useEffect } from "react"

const Confirmation = () => {
  useEffect(() => {
    localStorage.removeItem("cart")
  }, [])

  return (
    <>
      <div style={{ fontSize: '3rem', textAlign: 'center' }}>thank you</div>
      <div style={{ fontSize: '1.2rem', textAlign: 'center' }}>we have received your payment successfully</div>
    </>
  )
}

export default Confirmation