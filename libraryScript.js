

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
function addToBookshelf(newBook) {
	bookShelf.appendChild(newBook.element);
}

// holds the current library of books
let bookLibrary = [];

// holds the element representing the book shelf (i.e. the div
// container that holds the visual books)
const bookShelf = document.querySelector("#bookShelf");

bookLibrary.push(new Book("The Hobbit", "J.R.R. Tolkien", 562, true));
bookLibrary.push(new Book("Crime and Punishment", "Fyodor Dostoevsky",
	427, true));
bookLibrary.push(new Book("The Great Gatsby", "F. Scott Fitzgerald",
	189, false));
bookLibrary.push(new Book("The Odyssey", "Homer", 715, true));
bookLibrary.push(new Book("Catch-22", "Joseph Heller", 311, false));
addToBookshelf(bookLibrary[0]);
addToBookshelf(bookLibrary[1]);
addToBookshelf(bookLibrary[2]);
addToBookshelf(bookLibrary[3]);
addToBookshelf(bookLibrary[4]);

// reference to the modal content that is displayed when the
// user wants to add a book or to view the full details of
// a book
const modalCont = document.querySelector("#modal-background");

// reference to the modal box that allows the user to add a 
// book to the library
const addBox = document.querySelector("#add-box");

// reference to the modal box that allows the user to view 
// all of the information for a book and to mark the book as
// read and remove the book from the library
const bookViewBox = document.querySelector("#book-view");

// button to add a new book to the library
const addBtn = document.querySelector("#addBtn");

// button to clear all books from the library
const clrBtn = document.querySelector("#clrBtn");

// reference to the close button on the add a book box
const addClose = document.querySelector("#addClose");

// reference to body element
const body = document.querySelector("body");

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

// close the modal when the add box close button is clicked
addClose.addEventListener("click", function() {
	closeAddWindow();	
});

// close the add book window and clear all inputs / errors
function closeAddWindow() {
	clearAddFields();
	clearErrors();
	addOpen = false;
	modalCont.style.display = "none";
	addBox.style.display = "none";
	body.style.overflow = "visible";
}

// prevent clicks on the add box itself from closing out the modal 
// content
addBox.addEventListener("click", function(event) {
	event.stopPropagation();	
});

// error messages that are used for the add book window
const emptyError = document.createElement("P");
emptyError.textContent = "Error: fill in any empty field(s).";
const pagesError = document.createElement("P");
pagesError.textContent = "Error: # of pages needs to be a postive number" +
	" without any commas and without a decimal.";

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
		bookLibrary.push(new Book(titleInput.value, authorInput.value, 
			+(pagesInput.value), finishedInput.checked));
		addToBookshelf(bookLibrary[bookLibrary.length - 1]);
		// close the window
		closeAddWindow();
	}
});

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
