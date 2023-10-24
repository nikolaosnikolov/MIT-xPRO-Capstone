import React from "react"
import Rest from "../tools/rest.js"
import toast from '../components/toast.js'
import parseJWT from "../tools/parseJwt.js"

const SignUp = () => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

  return (
    <div id='signup-div'>
      <div style={{ width: '25rem !important' }} id='signup-form' className="card text-center">
        <div id='signup-header'>SignUp Form</div>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
          <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={(e) => setEmail(e.target.value)}></input>
          <div id='emailValidation' style={{ color: 'red' }}></div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
          <input type="password" className="form-control" id="exampleInputPassword1" onChange={(e) => setPassword(e.target.value)}></input>
          <div id='passwordValidation' style={{ color: 'red' }}></div>
        </div>
        <button style={{ width: '20rem !important' }} type="submit" className="btn btn-primary" onClick={async () => {
          const emailValidation = document.getElementById('emailValidation')
          const passwordValidation = document.getElementById('passwordValidation')

          if (email == "") {
            emailValidation.textContent = '*Required'
            return
          }

          if (!emailRegex.test(email)) {
            emailValidation.textContent = '*Bad email format'
            return
          }

          if (password == "") {
            passwordValidation.textContent = '*Required'
            emailValidation.textContent = ''
            return
          }

          passwordValidation.textContent = ''

          const result = await Rest('/api/signup', { username: email, password: password })
            .then((data) => {
              return data
            })

          toast("Successful SignUp", true)

          localStorage.token = result.token
          const decoded = parseJWT(result.token)
          localStorage.tokenExp = decoded.exp
          localStorage.tokenIat = decoded.iat
          localStorage.tokenUpdate = new Date().getTime()

          setTimeout(() => {
            location.reload()
            const link = document.createElement('a')
            link.href = '/'
            link.click()
          }, 2000)
        }}>Submit</button>
      </div>
    </div>
  )
}

export default SignUp