const { queryFromToStation } = require('../services/trainCheck');

module.exports.handleQueryFromToStation = async (req,res)=>{
    let result = await queryFromToStation();

    res.json(result);
}