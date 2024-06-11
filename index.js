const TelegramBot = require("node-telegram-bot-api");
const logger = require("morgan");
const express = require("express");
const cors = require("cors");
const productsRoute = require("./routes/api/products");
const authRouter = require("./routes/api/auth");
const token = "6747409661:AAEMQbvDDhrESv6zPqNwSv8IiYbp9C2Vvic";
const wedAppUrl = "https://adorable-lebkuchen-d0f7d9.netlify.app";
const bot = new TelegramBot(token, { polling: true });
const app = express();
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(express.json());
app.use(cors());
app.use("/api/products", productsRoute);
app.use("/api/auth", authRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;

  res.status(status).json({ message });
});

bot.on("polling_error", (error) => {});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    await bot.sendMessage(
      chatId,
      "Ласкаво просимо до нашого Telegram-бот. Тут ви можете отримати інформацію про наш асортимент товарів, їх характеристики та поточні акції.",
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Перейти до магазину", web_app: { url: wedAppUrl } }],
          ],
        },
      }
    );
  }
  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);

      await bot.sendMessage(chatId, "Дякую за замовлення");
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
      title: "Успішна покупка",
      input_message_content: {
        message_text: "Вітаемо з покупкою товара на:" + totalPrice,
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

module.exports = app;
