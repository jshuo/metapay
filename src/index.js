import './styles.css'
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { Button, Modal, Form, Alert } from 'react-bootstrap'
import AddForm from './AddForm'
import * as crypto from 'crypto'
const bs58 = require('bs58')
// import { EllipticCurve } from '@secux/transport/lib/ITransaction';
import { SecuxWebUSB } from '@secux/transport-webusb'
const { SecuxETH } = require('@secux/app-eth')
import Web3 from 'web3'
import { getAddressBalances } from 'eth-balance-checker/lib/web3'
const provider = require('eth-provider')
const { FIOSDK } = require('@fioprotocol/fiosdk')

const generateTestingFioDomain = () => {
  return `testing-domain-${Math.floor(Math.random() * 1000)}`
}
const payerfioAddress = 'jshuo@fiotestnet'
const payeefioAddress = 'secux@fiotestnet'

let privateKey = '5KDEgao6gCx8KvCgJVn5Nm6W4X9EkS8Uap4QydX2yezZrvkT9E6',
  publicKey = 'FIO5QvSU16Z6h57WhfqBJ1z1TrLUvUW5etmeHygfGhDFz6mQiJdcE'

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

function App() {
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const ETH_ACCOUNT_PATH: string = `m/44'/60'/0'`
  const FIO_ACCOUNT_PATH: string = `m/44'/235'/0'/0/0`
  const SECUX_ETH_ACCOUNT_PATH = ETH_ACCOUNT_PATH + '/0/0'
  const INFURA_ID = 'e9f62e559d264acca5fe498412c1d9b9'

  const connectWebUSB = async () => {
    let transport = await SecuxWebUSB.Create(
      async () => {
        console.log('connected')
      },
      async () => {
        console.log('disconnected')
      }
    )
    await transport.Connect()

    const FIO_PUBLIC_PREFIX = 'FIO'
    let pubBuf = await transport.getPublickey(FIO_ACCOUNT_PATH, 0)
    console.log(pubBuf.toString('hex'))
    const fio_address = await FIOSDK.getPublicKey(transport, FIO_ACCOUNT_PATH)
    let checksum = crypto.createHash('rmd160').update(pubBuf).digest('hex').slice(0, 8)
    pubBuf = Buffer.concat([pubBuf, Buffer.from(checksum, 'hex')])
    const FIOPubkeyAddress = FIO_PUBLIC_PREFIX.concat(bs58.encode(pubBuf))
    const fioSdk = new FIOSDK(privateKey, publicKey, 'http://testnet.fioprotocol.io/v1/', fetchJson, transport, '')
    // const defaultFee = 800 * fioSdk.FIOSDK.SUFUnit
    // const FIOAddress = await fio.genericAction('getFioAddresses', {fioPublicKey: pk.toString('hex')})
    const FIOAddress = await fioSdk.getFioAddresses(FIOPubkeyAddress)
    const { public_address: payeePublicKey } = await fioSdk.getPublicAddress(payeefioAddress, "FIO", "FIO")
    console.log(FIOAddress.fio_addresses[0].fio_address)
    const { fee } = await fioSdk.getFee('transfer_tokens_pub_key')
    const transferAmount = 168000000 // 1 FIO

    const result = await fioSdk.pushTransaction('fio.token', 'trnsfiopubky', {
      payee_public_key: payeePublicKey,
      amount: transferAmount,
      max_fee: fee,
      tpid: payerfioAddress
    })
    console.log(result)
    const address = await SecuxETH.getAddress(transport, SECUX_ETH_ACCOUNT_PATH)
    // const web3 = new Web3(provider("infura", { infuraId: INFURA_ID }));
    const web3 = new Web3(provider(`wss://rinkeby.infura.io/ws/v3/${INFURA_ID}`))

    let balance
    web3.eth.getBalance(address, async (err, result) => {
      if (err) {
        console.log(err)
        return
      }
      balance = web3.utils.fromWei(result, 'ether')
      console.log(balance + ' ETH')
      if (balance > 0.001) {
        handleShow()
      }
    })
  }
  return (
    <div>
      <table id="productlist">
        <thead>
          <tr>
            <th colspan="2">
              <h1>Products / Games / Videos For Sale</h1>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <img className="photo" src={'https://m.media-amazon.com/images/I/61+CDKTXYgL._AC_SX679_.jpg'} alt="" />
              <Form.Text style={{ fontSize: '16px', fontweight: 'bold' }}>AuKing Mini Projector 2022</Form.Text>
              <Form.Text style={{ fontSize: '16px', fontweight: 'bold' }}>
                <strong>$899.0</strong> FIO(s)
              </Form.Text>
              <Button variant="primary" onClick={connectWebUSB}>
                Connect SecuX to Pay
              </Button>
            </td>
            <td>
              <img className="photo" src={'https://m.media-amazon.com/images/I/71ZOtNdaZCL._FMwebp__.jpg'} alt="" />
              <Form.Text style={{ fontSize: '16px', fontweight: 'bold' }}>Apple iPhone 12 (64GB, Blue)</Form.Text>
              <Form.Text style={{ fontSize: '16px', fontweight: 'bold' }}>
                <strong>$39000.0</strong> FIO(s)
              </Form.Text>
              <Button variant="primary" onClick={connectWebUSB}>
                Connect SecuX to Pay
              </Button>
            </td>
          </tr>
        </tbody>
      </table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Coin with sufficient funds</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddForm />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
