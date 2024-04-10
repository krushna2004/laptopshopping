const mongoose = require('mongoose');

const connectDB = async (uri) =>{
   await mongoose.connect(uri, {
        useNewUrlParser:true,
        useUnifiedTopology:true,
    }).then(()=>console.log('Database Connected'))
    .catch((err)=>console.log(err));
}
module.exports = connectDB;