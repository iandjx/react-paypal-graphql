import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useMutation } from "@apollo/client";

import { gql } from "@apollo/client";

const CREATE_ORDER = gql`
  mutation createOrder {
    createOrder {
      orderID
    }
  }
`;

const CAPTURE_TRANSACTION = gql`
  mutation captureTRansaction($orderID: String) {
    captureTransaction(orderID: $orderID) {
      orderID
      paymentID
      grossAmount
      emailAddress
      value
      paymentStatus
    }
  }
`;

function App() {
  const payPalRef = React.useRef();
  const [orderID, setOrderID] = React.useState();
  const [createOrder] = useMutation(CREATE_ORDER);
  const [captureTransaction, { data: capturedTransaction }] = useMutation(
    CAPTURE_TRANSACTION
  );

  const p = window.paypal;
  const test = p.Buttons().render("body");
  // p.Buttons().render("#paypal-button-container"); // This function

  useEffect(() => {
    p.Buttons({
      createOrder: async () => {
        const { data } = await createOrder();
        console.log(data.createOrder);
        // await setOrderID(data.createOrder.orderID);
        let orderID = data.createOrder.orderID;
        console.log(orderID);
        return orderID;
      },
      onApprove: async (data) => {
        const { data: capturedData } = await captureTransaction({
          variables: {
            orderID: data.orderID,
          },
        });
        if (capturedData) {
          console.log(capturedData);
        }
        return capturedTransaction;
      },
    }).render(payPalRef.current);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div ref={payPalRef} />
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
