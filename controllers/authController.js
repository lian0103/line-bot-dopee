
module.exports.loginIn = (req,res,next)=>{

    console.log(req.body)
    const { name , psw } = req.body;
    
    res.json({status:200,body:req.body})

} 