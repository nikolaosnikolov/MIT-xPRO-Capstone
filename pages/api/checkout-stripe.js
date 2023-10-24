import Stripe from "stripe"

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

const handler = async (request, response) => {

    if (request.method !== "POST") {
        response.setHeader('Allow', 'POST');
        response.status(415).json({ error: { code: '', message: 'Bad request method.' } })
        return
    }

    const { items } = request.body
    const order = JSON.parse(items)
    const payment = order.items.reduce((accumulator, item) => {
        accumulator = Number(accumulator) + Number(item.total)
        return accumulator
    }, 0)


    const paymentIntent = await stripe.paymentIntents.create({
        amount: payment * 100,
        currency: "eur",
        payment_method_types: ['card'],
    })

    response.send({
        clientSecret: paymentIntent.client_secret,
    })
}

export default handler