import CheckoutForm from "../components/checkoutform.js"
import { loadStripe } from "@stripe/stripe-js"
import React from "react"
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const App = () => {
    const [payment, setPayment] = React.useState(false)
    const [clientSecret, setClientSecret] = React.useState("");

    React.useEffect(() => {
        fetch("/api/checkout-stripe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: localStorage.cart }),
        })
            .then((res) => res.json())
            .then((data) => (() => {
                setClientSecret(data.clientSecret)
            })());
    }, []);

    React.useEffect(() => {
        localStorage.token
            ? setPayment(true)
            : setPayment(false)
    }, [])

    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance,
    };

    return (
        <>
            {
                payment
                    ? (
                        <div className="App">
                            {clientSecret && (
                                <Elements options={options} stripe={stripePromise}>
                                    <CheckoutForm options={options} />
                                </Elements>
                            )}
                        </div>
                    )
                    : (
                        <div>Login first!!!</div>
                    )
            }
        </>
    );
}

export default App