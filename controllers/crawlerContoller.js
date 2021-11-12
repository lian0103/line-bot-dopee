const pttCrawlerService = require("../services/pttCrawler");

module.exports.handlePttCrawler = async (req, res) => {
  console.log(req.query);
  let { board, page } = req.query;
  if (!pttCrawlerService.boards.includes(board)) {
    res
      .status(400)
      .json({ status: 400, query: req.query, msg: "尚未支援這個看板" });
  }

  if (page > 20) {
    res
      .status(400)
      .json({ status: 400, query: req.query, msg: "page請小於等於20" });
  }

  console.log(typeof pttCrawlerService.pttCrawler)

  let data = await pttCrawlerService.pttCrawler({
    board: req.query.board,
    page: req.query.page,
  });

  console.log(data);

  res.status(200).json({ status: 200, query: req.query, data: data });
};
