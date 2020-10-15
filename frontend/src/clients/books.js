import axios from 'axios'

axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL

let transformError = async function (error) {
  let status
  let message

  if (error.response) {
    status = error.response.status
    message = error.response.data.message
  } else if (error.request) {
    status = 0
    message = 'No response received from server'
  } else {
    status = -1
    message = error.message
  }

  let transformedError = new Error(message)
  transformedError.status = status
  return transformedError
}

export default {
  async getBooks() {
    try {
      let response = await axios.get('/books')
      return response.data
    } catch (error) {
      throw transformError(error)
    }
  },
  async deleteBook(bookId) {
    try {
      await axios.delete('/books/' + bookId)
    } catch (error) {
      throw transformError(error)
    }
  },
  async updateBook(updatedBook) {
    try {
      await axios.patch('/books/' + updatedBook.id, updatedBook)
    } catch (error) {
      throw transformError(error)
    }
  },
  async addBook(updatedBook) {
    try {
      await axios.post('/books', updatedBook)
    } catch (error) {
      throw transformError(error)
    }
  },
  async borrowBookToggle(book) {
    try {
      await axios.patch('/books/' + book.id, { borrowed: !book.borrowed })
    } catch (error) {
      throw transformError(error)
    }
  }
}