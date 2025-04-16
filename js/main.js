const bookList = document.getElementById("book-list");
const searchInput = document.getElementById("searchInput");
const minYearInput = document.getElementById("minYear");
const maxYearInput = document.getElementById("maxYear");
const genreSelect = document.getElementById("genreSelect");
const sortSelect = document.getElementById("sortSelect");

const itemsPerPage = 10;
let currentPage = 1;

function getFilteredBooks() {
  let result = books.slice();

  const search = searchInput.value.toLowerCase();
  const minYear = parseInt(minYearInput.value);
  const maxYear = parseInt(maxYearInput.value);
  const genre = genreSelect.value;
  const sort = sortSelect.value;

  if (search) {
    result = result.filter((book) => book.title.toLowerCase().includes(search));
  }

  if (!isNaN(minYear)) {
    result = result.filter((book) => book.year >= minYear);
  }

  if (!isNaN(maxYear)) {
    result = result.filter((book) => book.year <= maxYear);
  }

  if (genre) {
    result = result.filter((book) => book.language.includes(genre));
  }

  if (sort === "title") {
    result.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === "year") {
    result.sort((a, b) => b.year - a.year);
  } else if (sort === "pages") {
    result.sort((a, b) => b.pages - a.pages);
  }

  return result;
}

function renderBooks(page) {
  const filteredBooks = getFilteredBooks();
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedBooks = filteredBooks.slice(start, end);

  bookList.innerHTML = "";

  paginatedBooks.forEach((book) => {
    const card = document.createElement("div");
    card.className = "book-card";

    card.innerHTML = `
      <img src="${book.imageLink}" alt="${book.title}" />
      <h2>${book.title}</h2>
      <p><strong>Country:</strong> ${book.country}</p>
      <p><strong>Pages:</strong> ${book.pages}</p>
      <p><strong>Year:</strong> ${book.year}</p>
      <a href="${book.link.trim()}" target="_blank" class="more-btn">More</a>
    `;

    bookList.appendChild(card);
  });

  renderPagination(filteredBooks.length);
}

function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pagination = document.createElement("div");
  pagination.className = "pagination";

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");
    btn.addEventListener("click", () => {
      currentPage = i;
      renderBooks(currentPage);
    });
    pagination.appendChild(btn);
  }

  const oldPagination = document.querySelector(".pagination");
  if (oldPagination) oldPagination.remove();
  document.querySelector(".container").appendChild(pagination);
}

[searchInput, minYearInput, maxYearInput, genreSelect, sortSelect].forEach(
  (input) => {
    input.addEventListener("input", () => {
      currentPage = 1;
      renderBooks(currentPage);
    });
  }
);

renderBooks(currentPage);
