import { useEffect, useState } from 'react'
import Rest from '../tools/rest.js'
import * as Math from '../tools/math.js'
import toast from '../components/toast.js'

const Dishes = () => {
  const [dishes, setDishes] = useState([])
  const [filtered, setFiltered] = useState()
  // const [activeID, setActiveID] = useState()

  const numbers = [1, 2, 3, 4, 5]

  useEffect(() => {
    Rest('/api/getdishes', { uid: localStorage.restaurant })
      .then(result => {
        setDishes(result.data)
        setFiltered(result.data)
      })
  }, [])


  const cart = {
    add: (object) => {
      const { uid, quantity, price, image, name } = object

      if (!localStorage.cart) {
        localStorage.cart = JSON.stringify({
          items: [],
          totalAmount: 0,
          totalQuantity: 0,
          lastUpdate: new Date().getDate()
        })
      }

      const localCart = JSON.parse(localStorage.cart)
      const existed = localCart.items.find(item => item._id === uid)

      existed
        ? (() => {
          existed.quantity = existed.quantity + Number(quantity)
          existed.total = existed.quantity * existed.price
        })()
        : localCart.items.push({
          _id: uid,
          quantity: Number(quantity),
          price: price,
          name: name,
          image: image,
          total: Number(quantity) * price
        })

      localCart.lastUpdate = new Date().getDate()
      localStorage.cart = JSON.stringify(localCart)

    }
  }

  return (
    <>
      <h3 style={{ textAlign: 'center', marginTop: '1rem' }}>Search for dishes that you want to eat</h3>
      <input id='input-search-dishes' placeholder='Type for search ...' onChange={(event) => {
        let dishesToShow = []
        const value = event.target.value.toLowerCase()
        const filterResult = filtered.filter(item => item.name.toLowerCase().includes(value))
        dishesToShow.push(...filterResult)
        setDishes(dishesToShow)
      }}></input>
      <div id="dishes-hoster">
        {
          dishes.map(item => {
            const quantityID = Math.Gen.RandomHex(6)
            const buttonID = Math.Gen.RandomHex(6)

            return (<div key={`2022-${item.name}`} className="card" style={{ width: '20rem' }}>
              <img src={`../images/${item.image}`} className="card-img-top" style={{ height: '12rem' }}></img>
              <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text">{item.description}</p>
                <p className="card-text">{`Price: €${item.price}`}</p>
                <select id={quantityID} /*onChange={() => {
                  setActiveID(item._id)
                }}*/>
                  {numbers.map(item => (
                    <option key={`${item}`}>{item}</option>
                  ))}
                </select>
                <button id={buttonID} /*disabled={Boolean(item._id !== activeID)}*/ className="btn btn-primary" style={{ width: '16rem' }} onClick={() => {
                  const select = document.getElementById(quantityID)
                  cart.add({
                    uid: item._id,
                    quantity: select.value,
                    price: item.price,
                    image: item.image,
                    name: item.name
                  })
                  toast("Product added successfully", true)
                }}>Add to Cart</button>
              </div>
            </div>
            )
          })
        }

      </div>
    </>

  )
}

export default Dishes