import { Nav, NavItem } from 'reactstrap'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import parseJWT from '../tools/parseJwt.js'
import { signOut } from 'next-auth/react'


const element = () => {
    const [activeUser, setActiveUser] = useState('')
    const [inCart, setInCart] = useState('')

    useEffect(() => {
        setInterval(() => {
            localStorage.cart && (() => {
                const cart = JSON.parse(localStorage.cart)
                setInCart(Number(cart.items.length))
            })()
        }, 500)
    }, [])

    useEffect(() => {
        const home = document.getElementById('home-page-link')
        const signup = document.getElementById('nav-signup')
        const signin = document.getElementById('nav-login')
        const user = document.getElementById('nav-user')
        const cart = document.getElementById('nav-cart')

        setInterval(() => {
            localStorage.token
                ? (() => {
                    const decoded = parseJWT(localStorage.token)
                    setActiveUser(decoded.username)

                    signin.style.setProperty('display', 'none')
                    signup.style.setProperty('display', 'none')
                    home.style.removeProperty('display')
                    user.style.removeProperty('display')
                    cart.style.removeProperty('display')
                })()
                : (() => {
                    setActiveUser('')
                    signin.style.removeProperty('display')
                    signup.style.removeProperty('display')
                    home.style.removeProperty('display')
                    user.style.setProperty('display', 'none')
                    cart.style.setProperty('display', 'none')
                })()
        }, 500)
    }, [])

    const closeLogout = () => {
        const logout = document.getElementById('logoutpop')
        logout.style.setProperty('display', 'none')
    }

    return (
        <>
            <Nav className="navbar navbar-dark bg-dark my-navigation">
                <NavItem style={{ display: 'none' }} id='home-page-link'>
                    <Link className="my-nav-item" href="/">Home</Link>
                </NavItem>
                <NavItem style={{ display: 'none' }} id='nav-signup' className="ml-auto">
                    <Link className="my-nav-item" href="/signup">SignUp</Link>
                </NavItem>
                <NavItem style={{ display: 'none' }} id='nav-login'>
                    <Link className="my-nav-item login" href="/login">SignIn</Link>
                </NavItem>
                <NavItem style={{ display: 'none', left: '6rem', position: 'absolute' }} id='nav-cart'>
                    <Link className="my-nav-item" href='/cart'>Cart</Link>
                    <div id='number-in-cart'>{inCart}</div>
                </NavItem>
                <NavItem style={{ display: 'none', right: '10px', position: 'absolute', cursor: 'pointer' }} id='nav-user'>
                    <div id='active-user' onClick={() => {
                        const logout = document.getElementById('logoutpop')
                        logout.style.removeProperty('display')
                        logout.focus()
                        logout.onclick = () => {
                            localStorage.provider == 'google' && (() => {
                                signOut()
                                document.cookie = "__Secure-next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 GMT;"
                            })()
                            window.localStorage.clear()
                            logout.style.setProperty('display', 'none')
                            const linkToClick = document.createElement('a')
                            linkToClick.href = '/logout'
                            linkToClick.click()
                        }
                    }}>{activeUser}</div>
                </NavItem>
                <div id='logoutpop' tabIndex="0" onBlur={() => {
                    closeLogout()
                }} style={{
                    display: 'none',
                    position: 'absolute',
                    right: '1rem',
                    top: '3rem',
                    padding: '1rem 2rem 1rem 2rem',
                    backgroundColor: 'bisque',
                    borderRadius: '1rem',
                    cursor: 'pointer'
                }}>Logout</div>
            </Nav>
        </>
    )
}

export default { element }