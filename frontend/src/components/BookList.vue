<template>
  <div>
    <b-table v-if="books[0]" striped :items="books" :fields="fieldsBooks" sort-by="title">
      <template .class="actionBtn" v-slot:cell(actions)="books">
        <b-btn class="actionBtn" variant="primary" size="sm" @click="borrow(books.item.id)">{{ books.item.borrowed ? 'Return' : 'Borrow' }}</b-btn>
        <b-btn class="actionBtn" variant="danger" size="sm" @click="deleteBook(books.item.id)">Delete</b-btn>
        <b-btn class="actionBtn" variant="success" size="sm" v-b-modal.edit-modal @click="fillEditModal(books.item)">Edit</b-btn>
      </template>
    </b-table>
    <div v-else>
      No books found
    </div>

    <b-modal id="edit-modal" lazy @ok="updateBook">
      <b-form @submit="updateBook">
        <b-form-group label="Book title">
          <b-input v-model="editBook.title"></b-input>
        </b-form-group>
        <b-form-group label="Book author">
          <b-input v-model="editBook.author"></b-input>
        </b-form-group>
    </b-form>
    </b-modal>

    <h2>Add Book</h2>
    <b-form @submit="addBook">
      <b-form-group label="Book title">
        <b-input v-model="newBook.title"></b-input>
      </b-form-group>
      <b-form-group label="Book author">
        <b-input v-model="newBook.author"></b-input>
      </b-form-group>
      <b-btn type="submit" variant="primary">Add</b-btn>
    </b-form>
  </div>
</template>

<script>
import booksClient from '../clients/books'

export default {
  name: 'BookList',
  data: function() {
    return {
      fieldsBooks: [
        {key: 'title', label: 'Title'},
        {key: 'author', label: 'Author'},
        {key: 'borrowed', label: 'Borrowed'},
        {key: 'actions', label: ''},
      ],
      books: [],
      newBook: {},
      editBook: {},
      error: null
    }
  },
  created: async function () {
    await this.initialize()
  },
  methods: {
    initialize: async function () {
      this.loadBooks()
    },
    loadBooks: async function () {
      try {
        this.books = await booksClient.getBooks()
      } catch (error) {
        this.books = []
        this.error = error
      }
    },
    deleteBook: async function (bookId) {
      await booksClient.deleteBook(bookId)
      await this.loadBooks()
    },
    addBook: async function(event) {
      event.preventDefault()
      await booksClient.addBook(this.newBook)
      this.newBook = {}
      await this.loadBooks()
    },
    borrow: async function(id) {
      var book = this.books.find( x => x.id === id)
      await booksClient.borrowBookToggle(book)
      await this.loadBooks()
    },
    fillEditModal: async function(book) {
      this.editBook = Object.assign({}, book)
    },
    updateBook: async function() {
      await booksClient.updateBook(this.editBook)
      await this.loadBooks()
    }
  }
}
</script>

<style>
  .actionBtn {
    margin-left: 0.2em;
    margin-right: 0.2em;
  }
</style>