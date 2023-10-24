import Stripe from 'stripe'

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

const handler = async (request, response) => {
    if (request.method !== "POST") {
        response.setHeader('Allow', 'POST');
        response.status(415).json({ error: { code: '', message: 'Bad request method.' } })
        return
    }

    try {
        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                    price: '{{PRICE_ID}}',
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${request.headers.origin}/?success=true`,
            cancel_url: `${request.headers.origin}/?canceled=true`,
        });
        response.redirect(303, session.url);
    } catch (err) {
        response.status(err.statusCode || 500).json(err.message);
    }
}

export default handler