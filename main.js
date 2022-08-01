
document.addEventListener('DOMContentLoaded', function() {

  // data buku
  const books = [];

  // for Storage
  const BOOKS_KEY = 'BOOKS_DATA';

  // custom Events
  const RENDER_EVENT = 'render-book'

  let searchedBook = null;

  const formSubmit = document.getElementById('inputForm');

  formSubmit.addEventListener('submit', function(ev) {
    ev.preventDefault();

    const judulInput = document.getElementById('judul').value;
    const penulisInput = document.getElementById('penulis').value;
    const tahunInput = document.getElementById('tahun').value;
    let state = false;
    
    // cek checked?
    if(document.getElementById('checkedBook').checked) {
      state = true;
    }

    const idBook = generateID();
    let bookObj = generateBook(idBook, judulInput, penulisInput, tahunInput, state);
    books.push(bookObj);

    document.dispatchEvent(new Event(RENDER_EVENT));

    // Save data
    saveData();

  });

  function generateID() {
    return +new Date();
  }

  function generateBook(id, title, author, year, isComplete) {
    return {
      id, 
      title, 
      author, 
      year, 
      isComplete
    }
  }

  document.addEventListener('render-book', function(ev) {

    const rakBelumSelesai = document.getElementById('belumSelesaiBook');

    rakBelumSelesai.innerHTML = '';

    const rakSudahSelesai = document.getElementById('sudahSelesaiBook');

    rakSudahSelesai.innerHTML = '';

    if(searchedBook != null) {

      let bookElem = makeBook(searchedBook);
      if(searchedBook.isComplete == true) {
        rakSudahSelesai.append(bookElem);
      } else {
        rakBelumSelesai.append(bookElem);
      }

    } else {
      for (const book of books) {

        let bookElem = makeBook(book);
        if(book.isComplete == true) {
          rakSudahSelesai.append(bookElem);
        } else {
          rakBelumSelesai.append(bookElem);
        }
  
      }
    }

  })

  function makeBook (book) {

    const textJudul = document.createElement('h3');
    textJudul.innerText = book.title;

    const textPenulis = document.createElement('p');
    textPenulis.innerText = "Penulis : " + book.author;

    const textTahun = document.createElement('p');
    textTahun.innerText = "Tahun : " + book.year;

    const container = document.createElement('article');
    container.classList.add('book-item');
    container.append(textJudul, textPenulis, textTahun);
    // container.setAttribute('id', `todo-${todoObj.id}`);


    if(book.isComplete) {

      const btnBelumSelesaiDibaca = document.createElement('button');
      btnBelumSelesaiDibaca.classList.add('green');
      btnBelumSelesaiDibaca.innerText = 'Belum Selesai dibaca';


      btnBelumSelesaiDibaca.addEventListener('click', function(ev) {
        belumSelesaiDibaca(book.id);
      })

      const btnHapus = document.createElement('button');
      btnHapus.classList.add('red');
      btnHapus.innerText = 'Hapus buku';

      btnHapus.addEventListener('click', function() {
        hapusBuku(book.id);
      })

      const btnContainer = document.createElement('div');
      btnContainer.classList.add('action');
      btnContainer.append(btnBelumSelesaiDibaca, btnHapus);

      container.append(btnContainer)

    } else {
      const btnSudahDibaca = document.createElement('button');
      btnSudahDibaca.classList.add('green');
      btnSudahDibaca.innerText = 'Selesai dibaca';


      btnSudahDibaca.addEventListener('click', function(ev) {
        sudahSelesaiDibaca(book.id);
      })

      const btnHapus = document.createElement('button');
      btnHapus.classList.add('red');
      btnHapus.innerText = 'Hapus buku';

      btnHapus.addEventListener('click', function() {
        hapusBuku(book.id);
      })

      const btnContainer = document.createElement('div');
      btnContainer.classList.add('action');
      btnContainer.append(btnSudahDibaca, btnHapus);

      container.append(btnContainer)

    }

    return container;

  }

  function sudahSelesaiDibaca(bookId) {


    const book = findBook(bookId);

    book.isComplete = true;

    document.dispatchEvent(new Event(RENDER_EVENT));
    
    // Save data
    saveData();

  }

  function belumSelesaiDibaca(bookId) {


    const book = findBook(bookId);

    book.isComplete = false;

    document.dispatchEvent(new Event(RENDER_EVENT));

    // Save data
    saveData();

  }


  function findBook(bookId) {
    return books.find((book) => book.id == bookId);
  }


  function hapusBuku(bookId) {

    const bookIndex = findIndexBook(bookId);

    books.splice(bookIndex, 1);

    document.dispatchEvent(new Event(RENDER_EVENT));

    // Save data
    saveData();

  }

  function findIndexBook(bookId) {

    return books.findIndex((book) => book.id == bookId);

  }


  const btnSearch = document.getElementById('searchBtn');
  const inputSearch = document.getElementById('searchBookInput');

  btnSearch.addEventListener('click', function() {

    if(inputSearch.value !== "") {

      const foundBook = searchBook(inputSearch.value);

      console.log(foundBook);
      searchedBook = foundBook;

      document.dispatchEvent(new Event(RENDER_EVENT));

    }

    searchedBook = null;

  })

  function searchBook(titleBook) {

    return books.find((book) => book.title == titleBook);

  }

  function isStorageExist() {

    if(typeof(Storage) === undefined) {

      alert('Tidak mendukung web storage!!');

      return false;

    }

    return true;

  }

  function saveData() {

    if(isStorageExist()) {

      const parsed = JSON.stringify(books);
      localStorage.setItem(BOOKS_KEY, parsed);
      
      // document.dispatchEvent(new Event(SAVED_EVENT))

    }

  }

  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(BOOKS_KEY);
    let datas = JSON.parse(serializedData);
   
    if (datas != null) {
      for (const book of datas) {
        books.push(book);
      } 
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  if(isStorageExist()) {
    loadDataFromStorage();
  }

})

