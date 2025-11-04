import { Order } from "../types";

const WEBHOOK_URL =
  "https://discord.com/api/webhooks/1417396829493919784/QpqDb3NAcscOz1SBDGF1YaAVf7eIUcdBYN_wvq3xKvfZvi0HsqSsr1auUF6kr_yhhglk";

export const sendCompletedOrderWebhook = async (order: Order) => {
  const message = {
    embeds: [
      {
        title: "Order Completed!",
        description: `Order #${order.id} has been marked as completed.`,
        color: 0x57f287, // Green
        fields: [
          {
            name: "Artwork",
            value: order.artwork.title,
            inline: true,
          },
          {
            name: "Artist",
            value: order.artistName,
            inline: true,
          },
          {
            name: "Client",
            value: order.clientName,
            inline: true,
          },
          {
            name: "Price",
            value: `₹${order.artwork.price}`,
            inline: true,
          },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      console.error("Failed to send webhook:", response.statusText);
    }
  } catch (error) {
    console.error("Error sending webhook:", error);
  }
};
