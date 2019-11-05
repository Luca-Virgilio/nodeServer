const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/siteDB', (err)=>{
    if(!err){
        console.log('mongoDB connected succeeded');
    } else{
        console.log(JSON.stringify(err, undefined, 2));
    }
});

module.exports = mongoose;