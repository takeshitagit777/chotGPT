import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({
      error: "STRIPE_SECRET_KEY が設定されていません。",
    });
  }

  if (!process.env.STRIPE_PRICE_ID) {
    return res.status(500).json({
      error: "STRIPE_PRICE_ID が設定されていません。",
    });
  }

  const siteUrl = process.env.SITE_URL || "https://www.chotchotgpt.com";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}?checkout=success`,
      cancel_url: `${siteUrl}?checkout=cancel`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    });

    return res.status(200).json({
      url: session.url,
    });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);

    return res.status(500).json({
      error: error?.message || "Stripe決済ページの作成に失敗しました。",
    });
  }
}
