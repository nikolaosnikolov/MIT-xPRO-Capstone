import { useEffect, useState } from "react"

const Details = () => {
    const [order, setOrder] = useState([])
    const [address, setAddress] = useState('')
    const [mobile, setMobile] = useState('')
    const [city, setCity] = useState('')

    useEffect(() => {
        localStorage.cart && (() => {
            const data = JSON.parse(localStorage.cart)
            setOrder(data.items)
        })()
    }, [])

    const payment = order.reduce((accumulator, item) => {
        accumulator = Number(accumulator) + Number(item.total)
        return accumulator
    }, 0)

    return (
        <>
            <div id="details-container">
                <div id="details-card">
                    <div className="mb-3" style={{ width: '25rem !important' }}>
                        <label htmlFor="exampleInputEmail1" className="form-label">Address</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={(e) => { setAddress(e.target.value) }}></input>
                        <div id="emailHelp" className="form-text" style={{ fontSize: '0.9rem' }}>Tell us where to bring your order</div>
                        <div id='addressValidation' style={{ color: 'red', display: 'none' }}></div>
                    </div>
                    <div className="mb-3" style={{ width: '25rem !important' }}>
                        <label htmlFor="exampleInputEmail1" className="form-label">City</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={(e) => { setCity(e.target.value) }}></input>
                        <div id="emailHelp" className="form-text" style={{ fontSize: '0.9rem' }}>Tell us the city where you live</div>
                        <div id='cityValidation' style={{ color: 'red', display: 'none' }}></div>
                    </div>
                    <div className="mb-3" style={{ width: '25rem !important' }}>
                        <label htmlFor="exampleInputPassword1" className="form-label">Phone Number</label>
                        <input type="text" className="form-control" id="exampleInputPassword1" onChange={(e) => { setMobile(e.target.value) }}></input>
                        <div id="emailHelp" className="form-text" style={{ fontSize: '0.9rem' }}>Please include your country telephone prefix</div>
                        <div id='mobileValidation' style={{ color: 'red', display: 'none' }}></div>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '25rem !important' }} onClick={() => {
                        const addressValidation = document.getElementById('addressValidation')
                        const cityValidation = document.getElementById('cityValidation')
                        const mobileValidation = document.getElementById('mobileValidation')

                        if (address === '') {
                            addressValidation.style.display = 'block'
                            cityValidation.style.display = 'none'
                            mobileValidation.style.display = 'none'

                            addressValidation.textContent = '*Required'
                            return
                        }

                        if (city === '') {
                            cityValidation.style.display = 'block'
                            addressValidation.style.display = 'none'
                            mobileValidation.style.display = 'none'

                            cityValidation.textContent = '*Required'
                            return
                        }

                        if (mobile === '') {
                            mobileValidation.style.display = 'block'
                            cityValidation.style.display = 'none'
                            addressValidation.style.display = 'none'
                            mobileValidation.textContent = '*Required'
                            return
                        }

                        mobileValidation.style.display = 'none'
                        cityValidation.style.display = 'none'
                        addressValidation.style.display = 'none'

                        localStorage.address = address
                        localStorage.mobile = mobile
                        localStorage.city = city
                        const link = document.createElement('a')
                        link.href = '/checkout'
                        link.click()
                    }}>Next</button>
                </div>
                <div id="payment-details">
                    {
                        order.map(item => {
                            const { name, quantity, price, total } = item
                            return (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    columnGap: '15rem',
                                    backgroundColor: 'bisque',
                                    padding: '1.2rem',
                                    borderRadius: '1rem',
                                    margin: '1rem'
                                }} key={name}>
                                    <div>
                                        <div>{name}</div>
                                        <div>{`${quantity}x`}</div>
                                        <div>{`€${price}`}</div>
                                    </div>
                                    <div style={{
                                        right: '3rem',
                                        position: 'absolute'
                                    }}>{`Cost: €${total}`}</div>
                                </div>
                            )
                        })
                    }
                    <div style={{
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        margin: '1rem',
                        right: '1rem',
                        position: 'absolute'
                    }}>{`Total: €${payment}`}</div>
                </div>
            </div>
        </>
    )
}

export default Details