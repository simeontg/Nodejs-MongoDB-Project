const { Schema, Types: {ObjectId} ,model } = require('mongoose');

const URL_PATTERN = /^https?:\/\/(.+)/

const bookSchema = new Schema({
    title: {type: String, required: true, minlength: [2, 'Title must be at least 4 characters long']},
    author: {type: String, minlength: [5, 'Author name must be at least 5 characters long']},
    genre: {type: String, required: true, minlength: [3, 'Genre must be at least 3 characters long']},
    imageUrl: {type: String, validate: {
        validator(value){
            return URL_PATTERN.test(value)
        },
        message: 'Image must be a valid URL'
    }},
    stars: {type: Number, required: true, min: 1, max: 5},
    review: {type: String, required: true, minlength: [10, 'Review must be at least 10 characters long']},
    owner: {type: ObjectId, required: true, ref: 'User'},
    wishingList: {type: [String], ref:'User', default: []}
})


const Book = model('Book', bookSchema);

module.exports = Book;