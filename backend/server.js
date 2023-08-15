const app = require('./app');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');
const environment = process.env.NODE_ENV || 'development';

// Handling Uncaught Exception - no such file or directory
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
});

//Config
dotenv.config({path:`backend/config/config.env.${environment}`})

//Connecting to DB
connectDatabase();

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
})


// Unhandled Promise Rejection - Not using a proper .catch(…) rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);
  
    server.close(() => {
      process.exit(1);
    });
});



//https://www.youtube.com/watch?v=AN3t-OmdyKA&t=3008s
