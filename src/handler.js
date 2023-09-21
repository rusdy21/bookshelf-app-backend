const { nanoid } = require('../node_modules/nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  // validasi input name and pageread
  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    // eslint-disable-next-line max-len
    id, name, year, author, summary, publisher, pageCount, readPage, reading, insertedAt, updatedAt, finished,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const allBookHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  let filterbook = books;

  // filter by name
  if (name) {
    // eslint-disable-next-line max-len
    filterbook = filterbook.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()) !== false);
  }

  // Filter by reading.
  if (reading) {
    filterbook = filterbook.filter((book) => Number(book.reading) === Number(reading));
  }

  // Filter by finished.
  if (finished) {
    filterbook = filterbook.filter((book) => Number(book.finished) === Number(finished));
  }

  return h.response({
    status: 'success',
    data: {
      books: filterbook.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },

  });
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((b) => b.id === id)[0];
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};
// edit book byid
const editBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // Validate input.
  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage '
        + 'tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  // Find book.
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    // Update book.
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt: new Date().toISOString(),
    };

    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
  }

  // If book not found.
  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  }).code(404);
};
// delete BookId
const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  // Find book.
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    // Delete book.
    books.splice(index, 1);

    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
  }

  // If book not found.
  return h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  }).code(404);
};
module.exports = {
  addBookHandler, allBookHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler,
};
