import { useEffect, useState } from 'react'
import * as Math from '../tools/math.js'
import cart from '../tools/cart.js'

const Cart = () => {
  const [order, setOrder] = useState([])
  const [showCart, setShowCart] = useState(false)

  useEffect(() => {
    localStorage.cart && (() => {
      let finalOrder = localStorage.cart
      finalOrder = JSON.parse(finalOrder)
      setOrder(finalOrder.items)
    })()
  }, [])

  useEffect(() => {
    localStorage.cart
      ? setShowCart(true)
      : setShowCart(false)
  }, [])

  return (
    <>
      {
        showCart
          ? (
            <div id='mainCart'>
              {order.length !== 0 ?
                order.map(item => {
                  const key = Math.Gen.RandomHex(6)

                  return (
                    <div key={key} id='product-to-buy'>
                      <div id='image-container'>
                        <img style={{ height: '6rem', width: '60%', borderRadius: '1rem' }} src={`../images/${item.image}`}></img>
                      </div>
                      <div id='data-container'>
                        <div style={{ fontSize: '1.2rem' }} id='product-name'>{item.name}</div>
                        <div className='counter'>
                          <div className='button-action' onClick={() => {
                            cart.update({ id: item._id, symbol: '-' })
                            const updated = JSON.parse(localStorage.cart)
                            setOrder(updated.items)
                          }}>-</div>
                          <div className='quantity'>{item.quantity}</div>
                          <div className='button-action' onClick={() => {
                            cart.update({ id: item._id, symbol: '+' })
                            const updated = JSON.parse(localStorage.cart)
                            setOrder(updated.items)
                          }}>+</div>
                        </div>
                        <div id='price-of-product'>{`Price: €${item.price}`}</div>
                      </div>
                      <div id='final-pay-for-product'>{`Total: €${item.total}`}</div>
                    </div>
                  )
                })
                : <div>No dishes!!!</div>
              }
              {order.length !== 0 && <div id="checkout-button" onClick={async () => {
                const finalOrder = []
                order.forEach(item => {
                  const { _id, quantity } = item
                  finalOrder.push({ _id: _id, quantity: quantity })
                  return finalOrder
                })

                const link = document.createElement('a')
                link.href = '/checkout-details'
                link.click()
              }}>Checkout</div>}
            </div >
          )
          : (
            <div>You need to order first!!!</div>
          )
      }
    </>

  )
}

export default Cart
