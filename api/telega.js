// pages/api/telega.js
import { MongoClient } from "mongodb";

let cachedClient = null;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { platform, steamId, pubgUid, amount } = req.body;

  // Проверка SteamID через внешний сервис
  if (platform.toLowerCase() === "steam") {
    try {
      const url = "https://desslyhub.com/api/v1/service/steamtopup/check_login";
      const options = {
        method: "POST",
        headers: {
          apikey: process.env.DESSLY_API_KEY,
          "content-type": "application/json",
        },
        body: JSON.stringify({ username: steamId, amount: 1 }), // amount=1 для проверки
      };

      const checkRes = await fetch(url, options);
      const checkData = await checkRes.json();

      if (!checkData.can_refill) {
        return res.status(400).json({
          error: "SteamID не подходит для пополнения",
          error_code: checkData.error_code || -100,
        });
      }
    } catch (err) {
      console.error("Ошибка проверки SteamID:", err);
      return res.status(500).json({ error: "Ошибка при проверке SteamID" });
    }
  }

  // Считаем сумму со скидкой
  const discountedAmount =
    platform.toLowerCase() === "steam"
      ? (amount * 0.9).toFixed(2)
      : (amount * 0.92).toFixed(2);

  const userIdText =
    platform.toLowerCase() === "steam"
      ? `🆔 Login Steam: ${steamId}`
      : `🆔 Pubg UID: ${pubgUid}`;

  const message = `✅ Новый заказ:
🎮 Платформа: ${platform}
${userIdText}
💵 Сумма: ${discountedAmount}`;

  try {
    // Отправка в Telegram
    await fetch(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: process.env.TG_CHAT_ID,
        text: message,
      }),
    });

    // Запрос к /api/order
    const orderRes = await fetch(`${req.headers.origin}/api/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await orderRes.json();
    if (!orderRes.ok) {
      throw new Error(data.error || "Ошибка при создании заказа");
    }

    // Сохраняем в MongoDB
    if (!cachedClient) {
      const client = new MongoClient(process.env.MONGODB_URI);
      cachedClient = await client.connect();
    }
    const db = cachedClient.db("Cheks");
    const orders = db.collection("orders");

    await orders.insertOne({
      ...data,
      discountedAmount,
      steamId,
      status: 1,
      createdAt: new Date(),
    });

    // Отправляем данные фронту
    res.status(200).json(data);
  } catch (err) {
    console.error("Ошибка в /api/telega:", err);
    res.status(500).json({ error: "Ошибка на сервере" });
  }
}
