
// reference to body element
const body = document.querySelector("body");

// holds the current library of books
let bookLibrary = [];

// holds the element representing the book shelf (i.e. the div
// container that holds the visual books)
const bookShelf = document.querySelector("#bookShelf");


// *** Data relating to main page buttons ***

// button to add a new book to the library
const addBtn = document.querySelector("#addBtn");

// button to clear all books from the library
const clrBtn = document.querySelector("#clrBtn");


// *** Data relating to the general modal content layout ***

// reference to the modal content that is displayed when the
// user wants to add a book or to view the full details of
// a book
const modalCont = document.querySelector("#modal-background");


// *** Data relating the the Add Book window ***

// reference to the modal box that allows the user to add a 
// book to the library
const addBox = document.querySelector("#add-box");

// reference to the close button on the add a book box
const addClose = document.querySelector("#addClose");

// button used to submit a new book
const newBookBtn = document.querySelector("#submitBook");

// each of the input fields for the window that allows the user
// to add a book
const titleInput = document.querySelector("#titleInput");
const authorInput = document.querySelector("#authorInput");
const pagesInput = document.querySelector("#pagesInput");
const finishedInput = document.querySelector("#hasRead");
const unfinishedInput = document.querySelector("#notRead");

// the error area for the window that allows the user to add a book
const errorArea = document.querySelector("#errorArea");

// holds true if the add book window is currently open
let addOpen = false;

// error messages that are used for the add book window
const emptyError = document.createElement("P");
emptyError.textContent = "Error: fill in any empty field(s).";
const pagesError = document.createElement("P");
pagesError.textContent = "Error: # of pages needs to be a postive number" +
	" without any commas and without a decimal.";


// *** Data relating to the book view window ***

// reference to the modal box that allows the user to view 
// all of the information for a book and to mark the book as
// read and remove the book from the library
const bookViewBox = document.querySelector("#book-view");

// holds the index in the bookLibrary array of the book that is
// currently being viewed in the book window
let curBookInd = -1;

// holds true if the book window currently has the finished button
let hasFinishedBtn = false;

// references to all of the relevant elements in the book view
// window
const bookClose = document.querySelector("#bookClose");
const titleElem = document.querySelector(".book-title");
const authorSpan = document.querySelector(".book-author");
const pagesSpan = document.querySelector(".book-pages");
const finishedPar = document.querySelector(".book-finished");
const btnsContainer = document.querySelector(".bookBtns");
const removeBtn = document.querySelector(".removeBtn");

// button that is added to the book view window if the book has
// not yet been finished (allowing the user to mark as finished)
const finishedBtn = document.createElement("BUTTON");
finishedBtn.textContent = "Mark as finished";
finishedBtn.classList.add("finishedBtn");


// *** Functions related to book construction ***

// Book constructor
function Book(title, author, pages, isRead) {
	this.title = title;
	this.author =  author;
	this.pages = pages;
	this.isRead = isRead;
	let colorVals = getRandColor();
	this.color = convertColor(colorVals, "color");
	this.backgroundColor = convertColor(oppositeColor(colorVals), 
		"background-color");
	this.element = makeBook(title, author, this.color, this.backgroundColor);
}

// returns a random color as a three element array. The elements
// represent percents of R, G, and B in that order. In order to get
// colors with more distinct opposites, percents can only be in the
// ranges of 0-30% or 70-100%
function getRandColor() {
	let colorValues = [];
	for (let i = 0; i < 3; i++) {
		let percent = Math.floor(Math.random() * 61);
		percent = (percent <= 30) ? percent : (percent + 40);
		colorValues.push(percent);
	}
	return colorValues;
}

// returns the opposite of a given color. Both the given color
// and the returned color are structured as three element arrays
// with the elements representing the R, G, and B percents 
// respectively
function oppositeColor(colorVals) {
	let oppoVals = [];
	for (let i = 0; i < colorVals.length; i++) {
		oppoVals.push(100 - colorVals[i]);
	}
	return oppoVals;
}

// takes an array representing a color as a three element array
// with percents of R, G, and B respectively and a property name.
// Returns a full property with an rgb value as a string.
function convertColor(colorVals, property) {
	let attString = property + ": rgb(";
	attString += colorVals[0].toString() + "%, " + colorVals[1].toString() +
		"%, " + colorVals[2].toString() + "%);";	
	return attString;
}

// makes and returns a reference to a DOM element corresponding to 
// a book on the main page
function makeBook(title, author, color, backgroundColor) {
	let newBook = document.createElement("DIV");
	newBook.classList.add("book");
	let attsStr = color + " " + backgroundColor;
	newBook.setAttribute("style", attsStr);
	// set an attribute representing the book's index in the bookLibrary
	// array
	let indexStr = (bookLibrary.length).toString();
	newBook.setAttribute("data-index", indexStr);
	
	let newTitle = document.createElement("H3");
	newTitle.textContent = title;	
	let newAuthor = document.createElement("H4");
	newAuthor.textContent = author;
	newBook.appendChild(newTitle);
	newBook.appendChild(newAuthor);

	return newBook;
}

// adds a book to the bookshelf. Takes as a parameter the Book
// object being added.
function addToBookshelf(title, author, pages, hasRead) {
	let newBook = new Book(title, author, pages, hasRead);
	bookLibrary.push(newBook);
	// create another row of the shelf if necessary
	if (bookLibrary.length % 3 === 1) {
		if (bookLibrary.length === 1) {
			bookShelf.setAttribute("style", "grid-template-rows: 200px;");	
		}
		else {
			bookShelf.style.gridTemplateRows += " 200px";
		}
	}
	bookShelf.appendChild(newBook.element);
	setBookListener(newBook);
}


// *** Functions related to the add book window ***


// close the add book window and clear all inputs / errors
function closeAddWindow() {
	clearAddFields();
	clearErrors();
	addOpen = false;
	modalCont.style.display = "none";
	addBox.style.display = "none";
	body.style.overflow = "visible";
}

// clears all error messages from the add book window
function clearErrors() {
	while(errorArea.lastChild) {
		errorArea.removeChild(errorArea.lastChild);
	}	
}

// checks if there are any errors in the inputs for the add book
// window. If there are, the relevant error messages are output to
// the window and true is returned. If there are no errors, false
// is returned.

function checkErrors() {
	let hasError = false;
	// make sure all of the fields are not blank	
	let newTitle = titleInput.value;
	let newAuthor = authorInput.value;
	let numPages = pagesInput.value;
	let hasRead = (finishedInput.checked) ? true : -1;
	if (hasRead === -1) {
		hasRead = (unfinishedInput.checked) ? false : -1;
	}

	if (newTitle === "" || newAuthor === "" || numPages === "" || 
		hasRead === -1) {
		hasError = true;
		errorArea.appendChild(emptyError);
	}	

	if (numPages !== "") {
		// make sure a positive integer was entered for # of pages
		numPages = +numPages;

		if (isNaN(numPages) || !(Number.isInteger(numPages)) || numPages <= 0) {
			hasError = true;
			errorArea.appendChild(pagesError);
		}
	}	

	return hasError;	
}

// clears all of the fields in the add book window
function clearAddFields() {
	titleInput.value = "";
	authorInput.value = "";
	pagesInput.value = "";
	finishedInput.checked = false;
	unfinishedInput.checked = false;
}

// *** Event listeners related to the add book window ***

// close the modal when the add box close button is clicked
addClose.addEventListener("click", function() {
	closeAddWindow();	
});

// adds a book with the given information, if all of the information
// in the window is filled out (and valid). Otherwise prints error
// message(s) to the window
newBookBtn.addEventListener("click", function() {
	// clear out any error messages from the last attempt
	clearErrors();
	// check if new inputs have any errors
	let hasErrors	= checkErrors();
	
	// no errors, so add the book and exit the window
	if (!hasErrors) {
		// add the new book to the library	
		addToBookshelf(titleInput.value, authorInput.value, 
			+(pagesInput.value), finishedInput.checked);	
		// close the window
		closeAddWindow();
	}
});

// bring up the modal content to add a book to the library when the
// add button is clicked
addBtn.addEventListener("click", function() {
	addOpen = true;
	modalCont.style.display = "block";
	addBox.style.display = "block";
	// get the current position of the scroll, so the position of 
	// the add box can be determined
	let curPos = document.documentElement.scrollTop || document.body.scrollTop;
	let newPadding = curPos + 135;
	newPadding = newPadding.toString() + "px";
	modalCont.style.padding_top = newPadding;
	// disallow scrolling while the modal content is up
	body.style.overflow = "hidden";
});

// prevent clicks on the add box itself from closing out the modal 
// content
addBox.addEventListener("click", function(event) {
	event.stopPropagation();	
});


// *** Functions related to the book view window ***

// sets up the window to view the total information on a total
// book
function setWindow(book) {
	curBookInd = +((book.element).dataset.index);

	// determine if the user can mark the book as finished
	if (book.isRead) {
		if (hasFinishedBtn) {
			btnsContainer.removeChild(btnsContainer.lastChild);	
			hasFinishedBtn = false;
		}
	}
	else {
		if (!hasFinishedBtn) {
			btnsContainer.appendChild(finishedBtn);	
			hasFinishedBtn = true;
		}
	}

	// set each of the fields according to the book's information
	titleElem.textContent = book.title;
	authorSpan.textContent = book.author;
	pagesSpan.textContent = (book.pages).toString();
	if (book.isRead) {
		finishedPar.textContent = "You have finished the book.";
	}
	else {
		finishedPar.textContent = "You have not finished the book.";
	}	
}

// opens the book viewing window
function openBookWindow() {
	modalCont.style.display = "block";
	bookViewBox.style.display = "block";
	// get the current position of the scroll, so the position of 
	// the book view box can be determined
	let curPos = document.documentElement.scrollTop || document.body.scrollTop;
	let newPadding = curPos + 135;
	newPadding = newPadding.toString() + "px";
	modalCont.style.padding_top = newPadding;
	// disallow scrolling while the modal content is up
	body.style.overflow = "hidden";
}

// close the book view window and clear all inputs / errors
function closeBookWindow() {		
	modalCont.style.display = "none";
	bookViewBox.style.display = "none";
	body.style.overflow = "visible";
}

// sets the listener that opens up the window with a book's full
// information
function setBookListener(book) {
	(book.element).addEventListener("click", function() {
		setWindow(book);
		openBookWindow();
	});	
}


// ** Event listeners related to the book view box ***

// prevent clicks on the book view box itself from closing out the modal 
// content
bookViewBox.addEventListener("click", function(event) {
	event.stopPropagation();	
});

// listener for the button that marks a book as read
finishedBtn.addEventListener("click", function() {
	bookLibrary[curBookInd].isRead = true;
	setWindow(bookLibrary[curBookInd]);	
});

// listener for the button that removes a book from the library
removeBtn.addEventListener("click", function() {
	bookShelf.removeChild(bookLibrary[curBookInd].element);
	bookLibrary.splice(curBookInd, 1);
	
	// update grid layout if this was only book on a row
	let curLen = bookLibrary.length;
	if (curLen !== 0 && curLen % 3 === 0) {
		let oldAtr = bookShelf.style.gridTemplateRows;
		bookShelf.style.gridTemplateRows = oldAtr.slice(0, oldAtr.length - 6);	
	}

	// decrement the indices for all book elements after the one deleted
	for (let i = curBookInd; i < bookLibrary.length; i++) {
		bookLibrary[i].element.dataset.index = i.toString();
	}
	closeBookWindow();
});

// close the modal when the book view box close button is clicked
bookClose.addEventListener("click", function() {
	closeBookWindow();	
});


// *** Other event listeners ***

// event listener for the button that is used to clear the whole 
// library (i.e. remove every book)
clrBtn.addEventListener("click", function() {
	while (bookShelf.lastChild) {
		bookShelf.removeChild(bookShelf.lastChild);
	}		
	bookLibrary.length = 0;
	bookShelf.style.gridTemplateRows = "200px";
});

// close the modal when the screen is clicked (i.e. outside of the modal
// box)
modalCont.addEventListener("click", function() {
	if (addOpen) {	
		clearAddFields();
		clearErrors();
		addOpen = false;
	}
	modalCont.style.display = "none";
	addBox.style.display = "none";
	bookViewBox.style.display = "none";
	body.style.overflow = "visible";
});


// *** Actions related to inital page setup ***

// add books to initial page so user can quickly see functionality
addToBookshelf("The Hobbit", "J.R.R. Tolkien", 562, true);
addToBookshelf("Crime and Punishment", "Fyodor Dostoevsky", 427, true);
addToBookshelf("The Great Gatsby", "F. Scott Fitzgerald", 189, false);
addToBookshelf("The Odyssey", "Homer", 715, true);
addToBookshelf("Catch-22", "Joseph Heller", 311, false);

