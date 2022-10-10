const Book = require('../models/Book')

async function createBook(book) {
    const result = new Book(book);
    await result.save();

    return result;
}

async function getBooks() {
    return Book.find({}).lean()
}

async function getBookByOwner(userId) {
    return Book.find({
        owner: userId
    }).lean()
}

async function getBookById(id) {
    return Book.findById(id).populate('owner').lean()
}

async function updateBook(id, book) {
    const existing = await Book.findById(id);
    existing.title = book.title
    existing.author = book.author
    existing.imageUrl = book.imageUrl
    existing.genre = book.genre
    existing.review = book.review
    existing.stars = book.stars

    await existing.save();

}

async function deleteBook(id) {
    return Book.findByIdAndDelete(id);
}

async function addToWishlist(bookId, userId){
    const book = await Book.findById(bookId)
    if(!book.wishingList.includes(userId)){
        book.wishingList.push(userId)
        await book.save()
    }
   
}

module.exports = {
    createBook,
    getBooks,
    getBookByOwner,
    getBookById,
    updateBook,
    deleteBook,
    addToWishlist
};