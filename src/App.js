import "./styles.css";
import { SecuxWebUSB } from "@secux/transport-webusb";
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import AddForm from "./AddForm";

export default function App() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleOpen = () => setShow(true);
  const connectWebUSB = async () => {
    let transport = await SecuxWebUSB.Create(
      () => handleOpen(),
      async () => {
        console.log("disconnected");
      }
    );
    await transport.Connect();
  };
  return (
    <div className="App">
      <Button onClick={connectWebUSB}>Pay Crypto</Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Insert Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddForm />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
