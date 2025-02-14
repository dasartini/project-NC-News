console.log("Starting.........")
const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});

console.log("enviroment is", ENV)
console.log("using", process.env.PGDATABASE)

// console.log(process.env.PGPASSWORD)
const config={

}
if( ENV === "production"){
  config.connectionString = process.env.DATABASE_URL;
  config.max= 2;
};
// if( ENV === "test"){
//   config.password = process.env.PGPASSWORD
// } 
if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE not set or DATABASE_URL not set');
};

module.exports = new Pool(config);
