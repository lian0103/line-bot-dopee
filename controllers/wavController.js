const path = require('path');

module.exports.handleGetStaticWav = async (req, res, next) => {
  var options = {
    root: path.join(process.cwd(), 'public', 'wavs'),
    dotfiles: 'deny',
    headers: {
      'content-type': 'jpeg',
      'x-timestamp': Date.now(),
      'x-sent': true,
    },
  };
  var fileName = req.params.name + '.wav';

  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      // console.log("Sent:", fileName);
    }
  });
};
