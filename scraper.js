const axios = require("axios");
const cheerio = require("cheerio");

async function fetchProductData(url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const productName = $("span").text().trim();
  const price = $(".price").text().trim();

  if (!productName || !price) {
    console.log("Failed to extract data for URL:", url);
    return null;
  }

  return { productName, price };
}

module.exports = { fetchProductData };
