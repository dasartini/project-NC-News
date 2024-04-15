//my callbackfunctions from models
const findTopics = require('./models')
const endpoint =require('../endpoints.json')


const getTopics = function (req, res, next) {
    return findTopics().then((topics) => {
        //console.log({topics}, "aaaaaaaaaaaaat controls")
        res.status(200).send({ topics })

    })
};

const beOnApi = function(req, res, next){
    console.log(endpoint)
    return res.status(200).send({endpoint})  
}

module.exports = {getTopics, beOnApi}