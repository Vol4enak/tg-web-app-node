const puppeteer = require("puppeteer");

async function searchProduct(productName) {
  const browser = await puppeteer.launch({ headless: false }); // Для наглядности отключим режим "headless"
  const page = await browser.newPage();

  try {
    await page.goto("https://www.google.com", { waitUntil: "networkidle2" });
    console.log("Page loaded.");
  } catch (error) {
    console.error("Error navigating to Google:", error);
    await browser.close();
    return [];
  }

  try {
    // Обновляем селектор до 'textarea[name="q"]', если Google использует <textarea>
    await page.waitForSelector('textarea[name="q"]', { timeout: 60000 });
    console.log("Search input selector found.");
  } catch (error) {
    console.error("Error waiting for input selector:", error);
    await browser.close();
    return [];
  }

  try {
    await page.type('textarea[name="q"]', productName + " site:shop");
    await page.keyboard.press("Enter");
    console.log("Search query typed and entered.");
  } catch (error) {
    console.error("Error typing in input or pressing Enter:", error);
    await browser.close();
    return [];
  }

  try {
    await page.waitForSelector("h3, a", { timeout: 60000 });
    console.log("Search results found.");
  } catch (error) {
    console.error("Error waiting for search results:", error);
    await browser.close();
    return [];
  }

  let links;
  try {
    links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("h3, a")).map((a) => {
        console.log(a);
        return a.href; 
      });
    });
    console.log("Links evaluated.");
  } catch (error) {
    console.error("Error evaluating links:", error);
    await browser.close();
    return [];
  }

  await browser.close();
  return links.slice(0, 10); // Возвращаем первые 10 результатов
}

// Пример использования функции

module.exports = { searchProduct };
