import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET);

const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{
        price_data: {
            currency: "kzt",
            product_data: { name: "Оплата обучения" },
            unit_amount: amount * 100,
        },
        quantity: 1,
    }],
    mode: "payment",
    success_url: "...",
    cancel_url: "..."
});
