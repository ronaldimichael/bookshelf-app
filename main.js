const books = [];

function saveData() {
  localStorage.setItem('books', JSON.stringify(books));
}

function loadData() {
  const data = localStorage.getItem('books');

  if (data) {
    const parsed = JSON.parse(data);

    books.length = 0;
    books.push(...parsed);
  }
}

function createBookElement(book) {
  const container = document.createElement('div');

  container.dataset.bookid = book.id;
  container.setAttribute('data-testid', 'bookItem');

  const title = document.createElement('h3');
  title.innerText = book.title;
  title.setAttribute('data-testid', 'bookItemTitle');

  const author = document.createElement('p');
  author.innerText = 'Penulis: ' + book.author;
  author.setAttribute('data-testid', 'bookItemAuthor');

  const year = document.createElement('p');
  year.innerText = 'Tahun: ' + book.year;
  year.setAttribute('data-testid', 'bookItemYear');

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('book-btn');

  // toggle button
  const toggleButton = document.createElement('button');

  if (book.isComplete) {
    toggleButton.innerText = 'Belum selesai dibaca';
  } else {
    toggleButton.innerText = 'Selesai dibaca';
  }

  toggleButton.setAttribute('data-testid', 'bookItemIsCompleteButton');

  toggleButton.addEventListener('click', function () {
    toggleBook(book.id);
  });

  /// delete button
  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'Hapus Buku';

  deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');

  deleteButton.addEventListener('click', function () {
    deleteBook(book.id);
  });

  // edit button
  const editButton = document.createElement('button');
  editButton.innerText = 'Edit Buku';

  editButton.setAttribute('data-testid', 'bookItemEditButton');

  editButton.addEventListener('click', function () {
    editBook(book.id);
  });

  buttonContainer.append(toggleButton, deleteButton, editButton);

  container.append(title, author, year, buttonContainer);

  return container;
}

function renderBooks() {
  const incompleteList = document.getElementById('incompleteBookList');

  const completeList = document.getElementById('completeBookList');

  incompleteList.innerHTML = '';
  completeList.innerHTML = '';

  for (const book of books) {
    const bookElement = createBookElement(book);

    if (book.isComplete) {
      completeList.append(bookElement);
    } else {
      incompleteList.append(bookElement);
    }
  }
}

// add books
document.getElementById('bookForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const title = document.getElementById('bookFormTitle').value;

  const author = document.getElementById('bookFormAuthor').value;

  const year = Number(document.getElementById('bookFormYear').value);

  const isComplete = document.getElementById('bookFormIsComplete').checked;

  const newBook = {
    id: Date.now(),
    title,
    author,
    year,
    isComplete,
  };

  books.push(newBook);

  saveData();
  renderBooks();

  this.reset();
});

function toggleBook(id) {
  const book = books.find((book) => book.id === id);

  if (!book) return;

  book.isComplete = !book.isComplete;

  saveData();
  renderBooks();
}

// delete books

function deleteBook(id) {
  const index = books.findIndex((book) => book.id === id);

  if (index === -1) return;

  books.splice(index, 1);

  saveData();
  renderBooks();
}

// edit books
function editBook(id) {
  const book = books.find((book) => book.id === id);

  if (!book) return;

  const newTitle = prompt('Edit Judul', book.title);

  if (newTitle === null || newTitle.trim() === '') {
    alert('Judul tidak boleh kosong');
    return;
  }

  const newAuthor = prompt('Edit Penulis', book.author);

  if (newAuthor === null || newAuthor.trim() === '') {
    alert('Penulis tidak boleh kosong');
    return;
  }

  const newYear = prompt('Edit Tahun', book.year);

  if (newYear === null || newYear.trim() === '' || isNaN(newYear)) {
    alert('Tahun harus angka');
    return;
  }

  book.title = newTitle.trim();
  book.author = newAuthor.trim();
  book.year = Number(newYear);

  saveData();
  renderBooks();
}

// search books
document.getElementById('searchBook').addEventListener('submit', function (e) {
  e.preventDefault();

  const keyword = document
    .getElementById('searchBookTitle')
    .value.toLowerCase();

  const filtered = books.filter((book) =>
    book.title.toLowerCase().includes(keyword),
  );

  renderFilteredBooks(filtered);
});

function renderFilteredBooks(filteredBooks) {
  const incompleteList = document.getElementById('incompleteBookList');

  const completeList = document.getElementById('completeBookList');

  incompleteList.innerHTML = '';
  completeList.innerHTML = '';

  for (const book of filteredBooks) {
    const bookElement = createBookElement(book);

    if (book.isComplete) {
      completeList.append(bookElement);
    } else {
      incompleteList.append(bookElement);
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  loadData();
  renderBooks();
});
