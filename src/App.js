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
const p = window.paypal;

function App() {
  const payPalRef = React.useRef();
  const [createOrder] = useMutation(CREATE_ORDER);
  const [
    captureTransaction,
    { loading, data: capturedTransaction },
  ] = useMutation(CAPTURE_TRANSACTION);

  useEffect(() => {
    p.Buttons({
      createOrder: async () => {
        const { data } = await createOrder();

        return data.createOrder.orderID;
      },
      onApprove: async (data) => {
        await captureTransaction({
          variables: {
            orderID: data.orderID,
          },
        });
      },
    }).render(payPalRef.current);
  }, []);

  if (loading) {
    return <div>loading...</div>;
  }
  if (capturedTransaction) {
    return <div>{JSON.stringify(capturedTransaction)}</div>;
  }

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
