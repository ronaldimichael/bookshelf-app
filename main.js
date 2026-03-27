const books = [];
function saveData() {
  localStorage.setItem('books', JSON.stringify(books));
}

function loadData() {
  const data = localStorage.getItem('books');

  if (data) {
    const parsed = JSON.parse(data);
    books.push(...parsed);
  }
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

function createBookElement(book) {
  const container = document.createElement('div');
  container.dataset.bookid = book.id;

  const title = document.createElement('h3');
  title.innerText = book.title;

  const author = document.createElement('p');
  author.innerText = 'Penulis: ' + book.author;

  const year = document.createElement('p');
  year.innerText = 'Tahun: ' + book.year;

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('book-btn');

  const toggleButton = document.createElement('button');
  toggleButton.innerText = book.isComplete ? 'Belum selesai' : 'Selesai dibaca';

  toggleButton.addEventListener('click', function () {
    toggleBook(book.id);
  });

  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'Hapus';
  deleteButton.addEventListener('click', function () {
    deleteBook(book.id);
  });

  const editButton = document.createElement('button');
  editButton.innerText = 'Edit';
  editButton.addEventListener('click', function () {
    editBook(book.id);
  });

  buttonContainer.append(toggleButton, deleteButton, editButton);

  container.append(title, author, year, buttonContainer);

  return container;
}

function toggleBook(id) {
  const book = books.find((b) => b.id === id);
  book.isComplete = !book.isComplete;

  saveData();
  renderBooks();
}

function deleteBook(id) {
  const index = books.findIndex((b) => b.id === id);
  books.splice(index, 1);

  saveData();
  renderBooks();
}

// Edit books
function editBook(id) {
  const book = books.find((b) => b.id === id);

  const newTitle = prompt('Edit Judul', book.title);
  if (newTitle === null) return;

  if (newTitle.trim() === '') {
    alert('Judul tidak boleh kosong!');
    return;
  }

  const newAuthor = prompt('Edit Penulis', book.author);
  if (newAuthor === null) return;

  if (newAuthor.trim() === '') {
    alert('Penulis tidak boleh kosong!');
    return;
  }

  const newYear = prompt('Edit Tahun', book.year);
  if (newYear === null) return;

  if (newYear.trim() === '' || isNaN(newYear)) {
    alert('Tahun harus diisi dan berupa angka!');
    return;
  }

  book.title = newTitle.trim();
  book.author = newAuthor.trim();
  book.year = Number(newYear);

  saveData();
  renderBooks();
}

// Search books
function searchBook(keyword) {
  const filtered = books.filter((book) =>
    book.title.toLowerCase().includes(keyword.toLowerCase()),
  );

  renderFilteredBooks(filtered);
}

document.getElementById('searchBook').addEventListener('submit', function (e) {
  e.preventDefault();

  const keyword = document.getElementById('searchBookTitle').value;

  searchBook(keyword);
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

document.getElementById('bookForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const newBook = {
    id: Date.now(),
    title: document.getElementById('bookFormTitle').value,
    author: document.getElementById('bookFormAuthor').value,
    year: Number(document.getElementById('bookFormYear').value),
    isComplete: document.getElementById('bookFormIsComplete').checked,
  };

  books.push(newBook);

  saveData();
  renderBooks();
});

document.addEventListener('DOMContentLoaded', function () {
  loadData();
  renderBooks();
});
