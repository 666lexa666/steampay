import { MongoClient } from "mongodb";
import fetch from "node-fetch";

const MERCHANT_ORDER_ID = "game-refill-pro"; // фиксированный id для теста
const MERCHANT_TSP_ID = 1408;
const MERCHANT_CALLBACK = "https://webhook-ooo.vercel.app/api/webhook";

let ordersClientPromise;
let tokenClientPromise;

// Подключение к основной базе заказов
async function getOrdersMongoClient() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI не задана");
  if (!ordersClientPromise) {
    const client = new MongoClient(process.env.MONGODB_URI);
    ordersClientPromise = client.connect();
  }
  return ordersClientPromise;
}

// Подключение к базе с токеном
async function getTokenMongoClient() {
  if (!process.env.MONGO_TOKEN_URI) throw new Error("MONGO_TOKEN_URI не задана");
  if (!tokenClientPromise) {
    const client = new MongoClient(process.env.MONGO_TOKEN_URI);
    tokenClientPromise = client.connect();
  }
  return tokenClientPromise;
}

// Получаем актуальный токен из БД
async function getAccessToken() {
  const client = await getTokenMongoClient();
  const db = client.db(process.env.MONGO_TOKEN_DB);
  const tokens = db.collection("tokens"); // коллекция с токеном
  const tokenDoc = await tokens.findOne({ name: "authToken" });
  if (!tokenDoc || !tokenDoc.value) throw new Error("Токен не найден в БД");
  return tokenDoc.value;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const { platform, steamId = "", pubgUid = "", amount } = req.body;
    if (!platform || !amount) {
      return res.status(400).json({ error: "Отсутствуют обязательные данные: platform или amount" });
    }

    const totalInCents = amount * 100; // сумма в копейках

    // Получаем токен из БД
    const accessToken = await getAccessToken();

    // Создание заказа
    const orderRes = await fetch("https://pay.kanyon.pro/api/v1/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        merchantOrderId: MERCHANT_ORDER_ID,
        paymentAmount: totalInCents,
        orderCurrency: "RUB",
        tspId: MERCHANT_TSP_ID,
        description: `Пополнение ${platform}`,
        callbackUrl: MERCHANT_CALLBACK,
      }),
    });
    const orderData = await orderRes.json();
    if (!orderData.order || !orderData.order.id) {
      throw new Error("Ошибка создания заказа: " + JSON.stringify(orderData));
    }

    // Получаем QR код
    const qrRes = await fetch(`https://pay.kanyon.pro/api/v1/order/qrcData/${orderData.order.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const qrData = await qrRes.json();

    // Подготовка документа заказа
    const orderDoc = {
      id: orderData.order.id,
      platform,
      steamId: platform === "steam" ? steamId : "",
      pubgUid: platform === "pubg" ? pubgUid : "",
      amount,
      orderAmount: totalInCents / 100,
      status: "В процессе",
      createdAt: new Date(),
      qrPayload: qrData?.order?.payload || null,
    };

    // Сохраняем заказ в основной базе
    const ordersClient = await getOrdersMongoClient();
    const db = ordersClient.db(process.env.MONGODB_DB);
    const orders = db.collection("orders");

    await orders.updateOne({ id: orderDoc.id }, { $set: orderDoc }, { upsert: true });

    return res.status(200).json({
      ok: true,
      qrPayload: orderDoc.qrPayload,
      operation_id: orderDoc.id,
    });
  } catch (error) {
    console.error("Ошибка:", error);
    return res.status(500).json({ error: error.message });
  }
}
