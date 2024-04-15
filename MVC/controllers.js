//my callbackfunctions from models
const findTopics = require('./models')


const getTopics = function(req, res, next){
return findTopics().then((topics)=>{
   //console.log({topics}, "aaaaaaaaaaaaat controls")
res.status(200).send({topics})

})

};

module.exports = getTopics