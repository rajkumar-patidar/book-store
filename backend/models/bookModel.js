const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
    title:{
        type: String,
        required: [true, "Please enter book name"],
        trim: true
    },
    description:{
        type: String,
        trim: true,
        required: [true, "Please enter book description"]
    },
    price:{
        type: Number,
        required: [true, "Please enter book price"],
        maxLength: [8, "Price can not exceed 8 charactors"]
    },
    author:{
        type: String,
        required:[true, "Please enter book author name"],
    },     
    pdf_url:{
            type: String,
            //required:true
    },
    category:{
        type: String,
        required:[true, "Please enter book category"]
    },       
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    publishedDate:{
        type: Date,
        default:Date.now
    },
    createAt:{
        type: Date,
        default:Date.now
    },
})

module.exports = mongoose.model("Book", bookSchema);
