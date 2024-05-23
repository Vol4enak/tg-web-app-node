const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const token = process.env.BOT_KEY;
const wedAppUrl = "https://adorable-lebkuchen-d0f7d9.netlify.app";

const bot = new TelegramBot(token, { polling: true });
const app = express();

app.use(express.json());
app.use(cors());
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  bot.sendMessage(chatId, "Received your message");

  if (text === "/start") {
    await bot.sendMessage(chatId, "Ниже кнопочка", {
      reply_markup: {
        keyboard: [
          [{ text: "заполнить форму", web_app: { url: wedAppUrl + "/form" } }],
        ],
      },
    });
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
      input_message_contentL: {
        message_text: "конграц с покупкой товара на:" + totalPrice,
      },
    });
    return res.status(200);
  } catch (e) {
    await bot.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title: "Не удалось совершить покупку",
      input_message_contentL: {
        message_text: "соболезнуем с неудачной покупкой товара",
      },
    });
    return res.status(500).json({});

  }
});

const PORT = 8000;
app.listen(PORT, () => console.log("server started on PORT 8000"));