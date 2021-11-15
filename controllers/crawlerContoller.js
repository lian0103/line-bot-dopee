const {
  boards,
  pttCrawler,
  getContainImgs,
} = require("../services/pttCrawler");

module.exports.handlePttCrawlerGetImgs = async (req, res) => {
  let { url } = req.query;

  if (url == "" || !url) {
    res
      .status(400)
      .json({ status: 400, query: req.query, msg: "請求參數url有誤" });
  }
  let result = await getContainImgs(url);
  res.status(200).json({ status: 200, query: req.query, data: result });
};

module.exports.handlePttCrawler = async (req, res) => {
  console.log(req.query);
  let { board, page } = req.query;
  if (!boards.includes(board)) {
    res
      .status(400)
      .json({ status: 400, query: req.query, msg: "尚未支援這個看板" });
  }

  if (page > 20) {
    res
      .status(400)
      .json({ status: 400, query: req.query, msg: "page請小於等於2" });
  }


  let data = await pttCrawler({
    board: req.query.board,
    page: req.query.page,
  });

  // console.log(data);

  res.status(200).json({ status: 200, query: req.query, data: data });
};
