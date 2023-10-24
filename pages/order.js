import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Order() {
  return (
    <div>
  <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Address</label>
    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"></input>
  </div>
  <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Postal Code</label>
    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"></input>
  </div>
  <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">CARD</label>
    <input type="password" class="form-control" id="exampleInputPassword1"></input>
  </div>
  <button type="submit" class="btn btn-primary">Pay</button>
    </div>
  )
}
