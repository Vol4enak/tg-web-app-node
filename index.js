const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const token = process.env.BOT_KEY;
const webAppUrl = "https://adorable-lebkuchen-d0f7d9.netlify.app";
const webhookUrl = "https://adorable-lebkuchen-d0f7d9.netlify.app"; // Ваш публичный URL

const bot = new TelegramBot(token);
const app = express();

app.use(express.json());
app.use(cors());

// Установите webhook
bot.setWebHook(`${webhookUrl}/bot${token}`);

app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    await bot.sendMessage(
      chatId,
      "Вітаю у боті, де ви зможете зручно знайти ваші улюблені товари.",
      {
        reply_markup: {
          keyboard: [
            [
              {
                text: "заполнить форму",
                web_app: { url: `${webAppUrl}/form` },
              },
            ],
          ],
        },
      }
    );
    await bot.sendMessage(chatId, "Заходи к нам", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "сделать заказ", web_app: { url: webAppUrl } }],
        ],
      },
    });
  }

  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);

      await bot.sendMessage(chatId, "спасибо за заказ");
      await bot.sendMessage(chatId, "страна: " + data?.country);
      await bot.sendMessage(chatId, "город: " + data?.street);
      await bot.sendMessage(chatId, "чтото: " + data?.subject);
      setTimeout(async () => {
        await bot.sendMessage(chatId, "всю инфу отправили");
      }, 1500);
    } catch (e) {
      console.log(e);
    }
  }
});

app.post("/web-data", async (req, res) => {
  const { queryId, products, totalPrice } = req.body;

  try {
    await bot.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title: "Успешная покупка",
      input_message_content: {
        message_text: "Поздравляем с покупкой товара на: " + totalPrice,
      },
    });
    return res.status(200).json({});
  } catch (e) {
    await bot.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title: "Не удалось совершить покупку",
      input_message_content: {
        message_text: "Сожалеем о неудачной покупке товара",
      },
    });
    return res.status(500).json({});
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Server started on PORT: " + PORT);
});
