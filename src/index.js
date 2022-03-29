import "./styles.css";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Button, Modal, Form } from "react-bootstrap";
import AddForm from "./AddForm";
import { SecuxWebUSB } from "@secux/transport-webusb";
const { SecuxETH } = require("@secux/app-eth");
import Web3 from "web3";
import { getAddressBalances } from "eth-balance-checker/lib/web3";
const provider = require("eth-provider");

function App() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const ETH_ACCOUNT_PATH: string = `m/44'/60'/0'`;
  const SECUX_ETH_ACCOUNT_PATH = ETH_ACCOUNT_PATH + "/0/0";
  const INFURA_ID = "e9f62e559d264acca5fe498412c1d9b9";
  const connectWebUSB = async () => {
    let transport = await SecuxWebUSB.Create(
      async () => {
        console.log("connected");
      },
      async () => {
        console.log("disconnected");
      }
    );
    await transport.Connect();
    const address = await SecuxETH.getAddress(
      transport,
      SECUX_ETH_ACCOUNT_PATH
    );
    const web3 = new Web3(provider("infura", { infuraId: INFURA_ID }));
    web3.eth.getBalance(address, async (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      let balance = web3.utils.fromWei(result, "ether");
      console.log(balance + " ETH");
    });
    handleShow();
  };
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
              <img className="photo" src={require("./secuxw20.jpg")} alt="" />
              <Form.Text style={{ fontSize: "16px", fontweight: "bold" }}>
                Price: $99.0 Tether(USDT), USDC, TerraUSD
              </Form.Text>
              <Button variant="primary" onClick={connectWebUSB}>
                Connect SecuX to Pay
              </Button>
            </td>
            <td>
              <img className="photo" src={require("./item1.png")} alt="" />
              <Form.Text style={{ fontSize: "16px", fontweight: "bold" }}>
                Price: $50.0 Tether(USDT), USDC, TerraUSD
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
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
