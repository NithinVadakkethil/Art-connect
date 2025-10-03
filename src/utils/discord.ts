// A utility function to send notifications to a Discord webhook.

// IMPORTANT: Replace this with your actual Discord webhook URL.
// It's recommended to store this in an environment variable for security.
const DISCORD_WEBHOOK_URL = "YOUR_DISCORD_WEBHOOK_URL_HERE";

interface DiscordEmbed {
  title?: string;
  description?: string;
  color?: number;
  fields?: { name: string; value: string; inline?: boolean }[];
  footer?: { text: string };
  timestamp?: string;
}

export const sendDiscordNotification = async (embed: DiscordEmbed) => {
  if (DISCORD_WEBHOOK_URL === "YOUR_DISCORD_WEBHOOK_URL_HERE") {
    console.warn("Discord webhook URL is not set. Skipping notification.");
    return;
  }

  const payload = {
    embeds: [
      {
        ...embed,
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`Discord notification failed with status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error sending Discord notification:", error);
  }
};
