const mongoose = require('mongoose');

const connectDatabase = () => {
    //Mongoose will ensure that only the fields that are specified in your schema will be saved in the database
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.DB_URL).then((data) => {
        console.log(`Mongodb connected with server: ${data.connection.host}`);
    });
}

module.exports = connectDatabase;