import { useEffect, useState } from 'react'
import Rest from '../tools/rest.js'
import parseJWT from '../tools/parseJwt.js'

const Home = () => {
  const [showRestuarants, setShowRestuarants] = useState(false)
  const [listRestuarants, setRestuarants] = useState([])
  const [filtered, setFiltered] = useState([])

  useEffect(() => {
    if (localStorage.length !== 0) {
      console.log('localStorage', localStorage)
      console.log('new Date().getTime', new Date().getTime())

      console.log(localStorage.tokenExp * 1000 > new Date().getTime())
      console.log(localStorage.tokenExp * 1000 - new Date().getTime())
      console.log(localStorage)
      console.log(7 * 60 * 60 * 1000)

      if (
        (localStorage.token) && (!localStorage.tokenExp || (localStorage.tokenExp * 1000 < new Date().getTime()) || (localStorage.tokenExp * 1000 - new Date().getTime() < 7 * 60 * 60 * 1000))
      ) {
        console.log('token expired')
        localStorage.clear()
        const link = document.createElement('a')
        link.href = '/'
        link.click
        location.reload()
      }
    }
  }, [])

  useEffect(() => {
    if (localStorage.token) {
      setShowRestuarants(true)
    } else {
      setShowRestuarants(false)
    }
  }, [])

  useEffect(() => {
    if (localStorage.token) {
      Rest('/api/getrestaurants', {})
        .then(result => {
          setRestuarants(result.data)
          setFiltered(result.data)
        });
    }
  }, [])

  return (
    <>
      {showRestuarants
        ? (
          <>
            <h3 style={{ textAlign: 'center', marginTop: '1rem' }}>Search for restaurants that you want to buy from</h3>
            <input id='input-search-restaurants' placeholder='Type for search ...' onChange={(event) => {
              let arrayToShow = []
              const value = event.target.value.toLowerCase()
              const filterResult = filtered.filter(item => item.name.toLowerCase().includes(value))
              arrayToShow.push(...filterResult)
              setRestuarants(arrayToShow)
            }}></input>
            <div id='restauants-hoster'>
              {
                listRestuarants.map(item => (
                  <div key={`2022-${item.name}`} id={item.id} className="card" style={{ width: '18rem' }}>
                    <img src={`../images/${item.image}`} className="card-img-top" style={{ height: '12rem' }}></img>
                    <div className="card-body">
                      <h5 className="card-title">{item.name}</h5>
                      <p className="card-text">{item.description}</p>
                      <a href="/dishes" className="btn btn-primary" style={{ width: '16rem' }} onClick={() => {
                        localStorage.restaurant = item.uid
                      }}>Visit us!</a>
                    </div>
                  </div>
                ))
              }
            </div>
          </>
        )
        : (
          <div id='not-logged-in'>
            <div id='header-not-logged-in'>Welcome to our efood website</div>
            <div id='includes-the-cards'>
              <div className="card" style={{ height: '16rem', width: '30rem !important' }}>
                <div className="card-header">SignIn</div>
                <div className="card-body">
                  <h5 className="card-title">SignIn to your account</h5>
                  <p className="card-text">SignIn to your account to buy your favorite food, quickly, and easily</p>
                  <a href="/login" className="btn btn-primary" style={{ width: '100% !important' }}>SignIn</a>
                </div>
              </div>
              <div className="card" style={{ height: '16rem', width: '30rem !important' }}>
                <div className="card-header">SignUp</div>
                <div className="card-body">
                  <h5 className="card-title">Create a new account</h5>
                  <p className="card-text">Create your next account, and get access to our platform in which you can buy your favorite food</p>
                  <a href="/signup" className="btn btn-primary" style={{ width: '100% !important' }}>SignUp</a>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </>
  )
}

export default Home