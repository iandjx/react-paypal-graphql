import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";

import { gql } from "@apollo/client";

const CREATE_ORDER = gql`
  mutation createOrder($newOrder: NewOrder) {
    createOrder(newOrder: $newOrder) {
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
  const { register, handleSubmit, watch, errors } = useForm();
  const onSubmit = (data) =>
    setNewOrder({
      ...data,
      invoiceId: newOrder.invoiceId,
    });
  const [newOrder, setNewOrder] = useState({
    currencyCode: "",
    value: 0.0,
    description: "",
    invoiceId: Math.random() * 12131 + "eskwOID",
  });
  const payPalRef = React.useRef();
  const [createOrder] = useMutation(CREATE_ORDER);
  const [
    captureTransaction,
    { loading, data: capturedTransaction },
  ] = useMutation(CAPTURE_TRANSACTION);

  useEffect(() => {
    p.Buttons({
      createOrder: async () => {
        console.log(newOrder);
        const { data } = await createOrder({
          variables: {
            newOrder: {
              currencyCode: newOrder.currencyCode,
              value: parseFloat(newOrder.value),
              description: newOrder.description,
              invoiceId: newOrder.invoiceId,
            },
          },
        });

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
  }, [captureTransaction, createOrder, newOrder]);

  if (loading) {
    return <div>loading...</div>;
  }
  if (capturedTransaction) {
    return <div>{JSON.stringify(capturedTransaction)}</div>;
  }

  return (
    <div className="App">
      <div ref={payPalRef} />
      {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* register your input into the hook by invoking the "register" function */}
        <input name="currencyCode" defaultValue="test" ref={register} />
        <input name="value" type="number" defaultValue={1.0} ref={register} />
        <input name="description" ref={register} />

        <input type="submit" />
      </form>
    </div>
  );
}

export default App;
