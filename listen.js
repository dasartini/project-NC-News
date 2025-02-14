
const app = require('./app')

const { PORT = 5059 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
