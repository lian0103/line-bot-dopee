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

const getCurPage = (board) => {
  return new Promise((resolv, reject) => {
    request(
      {
        url: nameMapUrl[board],
        method: "GET",
      },
      async (err, res, body) => {
        if (err) {
          reject("request fail");
        }
        switch (board) {
          case "Beauty": {
            let $ = cheerio.load(body); // 載入 body

            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
            await page.goto(nameMapUrl[board]);
            const buttonSelector =
              "body > div.bbs-screen.bbs-content.center.clear > form > div:nth-child(2) > button";

            await Promise.all([
              page.click(buttonSelector),
              page.waitForNavigation(),
            ]);

            const content = await page.content();

            $ = cheerio.load(content);

            const backBtnHref = $('a[class="btn wide"]').eq(1).attr("href");
            let curPageNum =
              parseInt(
                backBtnHref
                  .replace(`/bbs/${board}/index`, "")
                  .replace(".html", "")
              ) + 1;
            await browser.close();
            resolv(curPageNum);

            break;
          }
          case "Stock": {
            const $ = cheerio.load(body); // 載入 body
            const backBtnHref = $('a[class="btn wide"]').eq(1).attr("href");
            let curPageNum =
              parseInt(
                backBtnHref
                  .replace(`/bbs/${board}/index`, "")
                  .replace(".html", "")
              ) + 1;
            resolv(curPageNum);
            break;
          }
        }
      }
    );
  });
};

const requestData = (board, url) => {
  return new Promise((resolv, reject) => {
    request(
      {
        url: url,
        method: "GET",
      },
      async (err, res, body) => {
        if (err) {
          reject("request fail", err);
        }
        // console.log(body);
        let $ = cheerio.load(body); // 載入 body

        switch (board) {
          case "Beauty": {
            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
            await page.goto(nameMapUrl[board]);
            const buttonSelector =
              "body > div.bbs-screen.bbs-content.center.clear > form > div:nth-child(2) > button";

            await Promise.all([
              page.click(buttonSelector),
              page.waitForNavigation(),
            ]);

            const content = await page.content();

            $ = cheerio.load(content);
            await browser.close();
            break;
          }
        }

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
      }
    );
  });
};

const pttCrawler = ({ board = "Beauty", page = 3, img }) => {
  console.log("in~~pttCrawler");
  console.log(board, page);

  return new Promise(async (resolv, reject) => {
    let promiseArr = [];
    let curPageNum = await getCurPage(board);
    let arr = new Array(parseInt(page))
      .fill(curPageNum)
      .map((cur, index) => cur - index);
    console.log("arr", arr);
    arr.forEach((pageNum) => {
      console.log(getFormatPageUrl(board, pageNum));
      let url = getFormatPageUrl(board, pageNum);
      promiseArr.push(requestData(board, url));
    });
    Promise.all(promiseArr)
      .then((resAll) => {
        switch (board) {
          case "Stock": {
            resolv(resAll);
            break;
          }
          case "Beauty": {
            let deepPromiseAll = [];

            let arr = resAll.reduce((prev, next) => prev.concat(next));

            arr.forEach((item) => {
              let deepUrl = "https://www.ptt.cc" + item.link;
              deepPromiseAll.push(
                new Promise((resolv, reject) => {
                  request(
                    {
                      url: deepUrl,
                      method: "GET",
                    },
                    (err, deepRes, body) => {
                      console.log(body);
                    }
                  );
                })
              );
            });

            Promise.all(deepPromiseAll).then((deepResAll) => {
              resolv(deepResAll);
            });

            break;
          }
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = {
  boards: Object.keys(nameMapUrl),
  pttCrawler,
};

// pttCrawler({});

async function test() {
  const url = "https://www.ptt.cc/bbs/Beauty/M.1636641491.A.A33.html";
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  Promise.all([
    page.setCookie({ url: url, name: "over18", value: "1" }),
    page.goto(url),
  ]).then(async () => {
    const content = await page.content();
    let $ = cheerio.load(content);

    const list = $('a[target="_blank"]');

    console.log(list);
    let imgs = [];

    for (let i = 0; i < list.length; i++) {
      if (/\.(http|https)/.test(list.eq(i).text())) {
        console.log(true)
      }
      imgs.push(list.eq(i).text());
    }
    console.log(imgs);
  });
}

test();
