const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios"); // Убедитесь, что axios импортирован
const express = require("express");
const cors = require("cors");

const token = "6747409661:AAEMQbvDDhrESv6zPqNwSv8IiYbp9C2Vvic";
const wedAppUrl = "https://adorable-lebkuchen-d0f7d9.netlify.app";

const bot = new TelegramBot(token, { polling: true });
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());
bot.on("polling_error", (error) => {});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    await bot.sendMessage(
      chatId,
      "Вітаю у боті в якому ви зможете зручно знайти ваші улюблені товари.",
      {
        reply_markup: {
          keyboard: [
            [
              {
                text: "заполнить форму",
                web_app: { url: wedAppUrl + "/form" },
              },
            ],
          ],
        },
      }
    );
    await bot.sendMessage(chatId, "Заходи к нам", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "сделать заказ", web_app: { url: wedAppUrl } }],
        ],
      },
    });
  }

  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);

      await bot.sendMessage(chatId, "спасибо за заказ");
      await bot.sendMessage(chatId, "страна:" + " " + data?.country);
      await bot.sendMessage(chatId, "город:" + " " + data?.street);
      await bot.sendMessage(chatId, "чтото:" + " " + data?.subject);
      setTimeout(async () => {
        await bot.sendMessage(chatId, "всю инфу отправили");
      }, 3000);
    } catch (e) {
      chatId, console.log(e);
    }
  }
});

app.post("/web-data", async (req, res) => {
  const { queryId, products, totalPrice } = req.body;

  try {
    await bot.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title: "Успешна покупка",
      input_message_content: {
        message_text: "конграц с покупкой товара на:" + totalPrice,
      },
    });
    return res.status(200).json({});
  } catch (e) {
    await bot.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title: "Не удалось совершить покупку",
      input_message_content: {
        message_text: "соболезнуем с неудачной покупкой товара",
      },
    });
    return res.status(500).json({});
  }
});

app.get("/api/data", async (req, res) => {
  try {
    const response = await axios.get("https://fakestoreapi.in/api/products");

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error.message);

    res.status(500).json({ error: "Ошибка при получении данных" });
  }
});
app.get("/api/category", async (req, res) => {
  try {
    const response = await axios.get(
      "https://fakestoreapi.in/api/products/category"
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error.message);

    res.status(500).json({ error: "Ошибка при получении данных" });
  }
});
app.get("/api/products", async (req, res) => {
  const category = req.query.category; 
  try {
    const response = await axios.get(
      `https://fakestoreapi.in/api/products/category?type=${category}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Ошибка при запросе к внешнему API: ", error);
    res.status(500).send("Ошибка сервера");
  }
});

app.listen(PORT, () => console.log("server started on PORT: " + PORT));
