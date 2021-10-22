require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');


mongoose.connect(process.env.MONGO_DB_URL, {
    serverSelectionTimeoutMS: 50000
}).then(() => console.log('Mogoose Server is Conected!!'))
  .catch((error) => console.log(error));


const port = 3300;
app.listen(port, ()=>{
    console.log(`Server is on: ${port}`)
});