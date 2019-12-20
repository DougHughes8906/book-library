

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
addToBookshelf(bookLibrary[0]);
addToBookshelf(bookLibrary[1]);

