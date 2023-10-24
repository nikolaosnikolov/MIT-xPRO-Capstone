import React from "react";
import {
    PaymentElement,
    LinkAuthenticationElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import Rest from "../tools/rest.js"
import parseJWT from "../tools/parseJwt.js"
import toast from "./toast.js"

const CheckoutForm = ({ options }) => {
    const { clientSecret } = options
    const stripe = useStripe();
    const elements = useElements();

    const [email, setEmail] = React.useState('');
    const [message, setMessage] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent.status) {
                case "succeeded":
                    setMessage("Payment succeeded!");
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setMessage("Your payment was not successful, please try again.");
                    break;
                default:
                    setMessage("Something went wrong.");
                    break;
            }
        });
    }, [stripe]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: "https://nikolaos-nikolovfullstackrestaurantapplication.mymit.eu/confirmation",
            },
        });

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message);
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    const paymentElementOptions = {
        layout: "tabs",
    };

    const totalAmount = JSON.parse(localStorage.cart)
    const payment = totalAmount.items.reduce((accumulator, item) => {
        accumulator = Number(accumulator) + Number(item.total)
        return accumulator
    }, 0)

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <LinkAuthenticationElement
                id="link-authentication-element"
            />
            <PaymentElement id="payment-element" options={paymentElementOptions} />
            <button style={{
                marginTop: '1rem',
                padding: '1rem 2rem 1rem 2rem',
                border: '1px solid black',
                borderRadius: '1rem',
                backgroundColor: 'cadetblue',
                cursor: 'pointer'
            }} disabled={isLoading || !stripe || !elements} id="submit" onClick={async () => {
                const paymentElement = document.getElementById('payment-element')
                await Rest('/api/order', { items: JSON.parse(localStorage.cart).items, address: localStorage.address, mobile: localStorage.mobile, city: localStorage.city })
                    .then(result => console.log('result', result))

                const decoded = parseJWT(localStorage.token)

                stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: paymentElement,
                        billing_details: {
                            name: decoded.username,
                            mobile: localStorage.mobile,
                            city: localStorage.city,
                            address: localStorage.address
                        },
                    },
                })
                    .then(result => {
                        console.log('result', result)
                    })
            }}>
                <span id="button-text">
                    {isLoading ? <div className="spinner" id="spinner"></div> : `Pay €${payment}`}
                </span>
            </button>
            {message && toast("Successful payment", true)}
        </form>
    );
}

export default CheckoutForm