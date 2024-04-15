const db = require('../db/connection')

function findTopics(){
return db.query(`
SELECT * FROM topics`).then(({rows})=>{
 //console.log(rows , 'AAAAAAT MODELS')
    return rows
});

};


module.exports = findTopics