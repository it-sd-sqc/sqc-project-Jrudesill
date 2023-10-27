const fs = require('fs');
const cheerio = require('cheerio');
const sqlite3 = require('sqlite3').verbose();

// Create a new SQLite database
const db = new sqlite3.Database('book_data.db');

// Create a table for chapters
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS chapters (id INTEGER PRIMARY KEY, title TEXT)');
    db.run('CREATE TABLE IF NOT EXISTS characters (id INTEGER PRIMARY KEY, name TEXT)');
});

// Load the HTML content of the book
const bookHTML = fs.readFileSync('../data/persuasion.html', 'utf8');

// Load the HTML content into cheerio
const $ = cheerio.load(bookHTML);

// Extract chapter names and character names
const chapterNames = [];
const characterNames = [];

$('h2').each((index, element) => {
    // Assuming that chapter titles are contained within <h2> tags
    chapterNames.push($(element).text());
});
$('.character').each((index, element) => {
    // Assuming that character names are contained within elements with a class "character"
    characterNames.push($(element).text());
});

// Insert data into the database
db.serialize(() => {
    const chapterStmt = db.prepare('INSERT INTO chapters (title) VALUES (?)');
    const characterStmt = db.prepare('INSERT INTO characters (name) VALUES (?)');

    chapterNames.forEach((name) => {
        chapterStmt.run(name);
    });

    characterNames.forEach((name) => {
        characterStmt.run(name);
    });

    chapterStmt.finalize();
    characterStmt.finalize();

    console.log('Data has been inserted into the database.');
});

// Close the database
db.close();