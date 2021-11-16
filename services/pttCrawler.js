//on heroku server need these buildpack:
//https://github.com/jontewks/puppeteer-heroku-buildpack
//https://github.com/CoffeeAndCode/puppeteer-heroku-buildpack

const request = require("request");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

const nameMapUrl = {
  Stock: "https://www.ptt.cc/bbs/Stock/index.html",
  Beauty: "https://www.ptt.cc/bbs/Beauty/index.html",
};

const getFormatPageUrl = (name, page) => {
  if (nameMapUrl[name]) {
    return nameMapUrl[name].replace("index", `index${page}`);
  }
};

const getPageContent = (url) => {
  return new Promise(async (resolv, reject) => {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      ignoreDefaultArgs: ["--disable-extensions"],
      headless: true,
    });
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (
        ["image", "stylesheet", "font", "script"].indexOf(
          request.resourceType()
        ) !== -1
      ) {
        request.abort();
      } else {
        request.continue();
      }
    });

    Promise.all([
      page.setCookie({ url: url, name: "over18", value: "1" }),
      page.goto(url),
    ])
      .then(async () => {
        const content = await page.content();
        await browser.close();
        resolv(content);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getCurPage = (board) => {
  return new Promise(async (resolv, reject) => {
    const content = await getPageContent(nameMapUrl[board]);
    const $ = cheerio.load(content);
    const backBtnHref = $('a[class="btn wide"]').eq(1).attr("href");
    let curPageNum = backBtnHref
      ? parseInt(
          backBtnHref.replace(`/bbs/${board}/index`, "").replace(".html", "")
        ) + 1
      : 0;
    resolv(curPageNum);
  });
};

const getContainImgs = (url) => {
  // console.log(url);
  return new Promise(async (resolv, reject) => {
    const content = await getPageContent(url);
    let $ = cheerio.load(content);
    const list = $('a[target="_blank"]');
    let imgs = [];
    const regex = new RegExp(/\.(https|jpg|jdpg)/g);
    for (let i = 0; i < list.length; i++) {
      let str = list.eq(i).text();
      if (regex.test(str)) {
        imgs.push("" + list.eq(i).text());
      }
    }
    // console.log(imgs);
    resolv(imgs);
  });
};

const requestCardListDatas = (url) => {
  return new Promise(async (resolv, reject) => {
    const content = await getPageContent(url);
    const $ = cheerio.load(content);
    const list = $(".r-list-container .r-ent");
    let data = [];
    for (let i = 0; i < list.length; i++) {
      const title = list.eq(i).find(".title a").text();
      const author = list.eq(i).find(".meta .author").text();
      const date = list.eq(i).find(".meta .date").text();
      const link = list.eq(i).find(".title a").attr("href");
      data.push({ title, author, date, link });
    }
    resolv(data);
  });
};

const pttCrawler = ({ board = "Beauty", page = 2, img }) => {
  console.log("in~~pttCrawler", board, page);
  page = parseInt(page) > 2 ? 2 : page;

  return new Promise(async (resolv, reject) => {
    let promiseArr = [];
    let curPageNum = await getCurPage(board);
    let arr = new Array(parseInt(page))
      .fill(curPageNum)
      .map((cur, index) => cur - index);
    console.log("arr", arr);
    arr.forEach((pageNum) => {
      let url = getFormatPageUrl(board, pageNum);
      promiseArr.push(requestCardListDatas(url));
    });
    Promise.all(promiseArr)
      .then((resAll) => {
        resolv(resAll);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = {
  boards: Object.keys(nameMapUrl),
  pttCrawler,
  getContainImgs,
};
