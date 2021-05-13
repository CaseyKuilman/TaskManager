// ### INFO ### This is my solution to a programming challenge I found. It may not be the most efficient and/or practical implementation, and I do not offer any form of warranty on it.
// Code written by Casey Kuilman (github.com: CaseyKuilman)
// --------------------------------------------------------------------------------- //


//Imports
//const readline = require("readline");
const sqlite3 = require('sqlite3').verbose(); //the .verbose() is how the SQLite 3 Node.JS guide applies it; the guide: "Notice that the execution mode is set to verbose to produce long stack traces."
const prompts = require('prompts');

//Definitions
prompts.override(require('yargs').argv);
//define readline's interface input/output handling with pipes \\ NOT USED IN THE FINAL VERSION
/*const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});*/

//define DB_PATH - MODIFY THIS TO FIT THE RELATIVE PATH OF YOUR DB FILE
const DB_PATH = './databases/default.db';

// start DB connection
const DB = new sqlite3.Database(DB_PATH, function(err){
    if (err) {
        console.log("An error occured when starting the database connection: " + err);
        return;
    } else {
        console.log('Connected to the database.');
    };
    
    //Attempt to enable Foreign Key Enforcement, which is disabled by default in SQLite3 (at least in the NODEJS version)
    DB.exec('PRAGMA foreign_keys = ON;', function(err)  {
        if (err){
            console.error("Pragma statement caused an error: " + err);
        } else {
            console.log("Foreign Key Enforcement enabled.");
        };
    });
});

//db schema
let dbSchema = (
`CREATE TABLE IF NOT EXISTS Tasks (
    num integer NOT NULL PRIMARY KEY,
    task_name text NOT NULL
 );` );

DB.exec(dbSchema, function(err){
    if (err) {
        console.log(err);
    } else {
        console.log("DB Schema loaded.");
    };
 });

//Functions

// -- this function is defect and not used anywhere
/*
function doesEntryExist(num) {
    var entryExists;
    var sql = "SELECT * FROM Tasks "
    sql+= "WHERE num = ?"
    DB.get(sql, num, function(err, row) {
        if (row === undefined || row === "undefined") {
            return false;
            entryExists = false;
        } else {
            return true;
            entryExists = true;
        };
    });
};*/

function newTask(num, task_name) {
   //if task's number does not exist: create task in the database
   var sql = "INSERT INTO Tasks (num, task_name) ";
   sql += "VALUES (?, ?) ";

   DB.run(sql, [num, task_name], function(err) {
       if (err) {
           console.log("An error occured when writing a new task to the database: " + err);
       } else {
       console.log("Added the task succesfully.");
       };
   });
};

function editTask(num, task_name) {
    var sqlthis = "UPDATE Tasks SET task_name = ? WHERE num = ? ";
 
    DB.run(sqlthis, [task_name, num], function(err) {
        if (err) {
            console.log("An error occured when editing a task in the database: " + err);
        } else {
        console.log("Edited the task succesfully.");
        };
 });
};

 function removeTask(num) {
    //if task's number does exist: remove task from the database
    var sql = "DELETE FROM Tasks ";
    sql+= "WHERE num = ?";
    DB.run(sql, num), function(error) {
        if (error) {
            console.log("An error occured when deleting a task from the database: " + error);
        } else {
        console.log("Deleted the task succesfully."); //this text seems to somehow not output to console. due to the informal nature of the project I decided to not spent too much time on it, so just know it is a bit inconsistent. this is likely due to the async nature of the sqlite3 module.
        };
    };
 };

 function showTask(num) {
      // if task's number exists, show task name
    var sql = "SELECT task_name FROM Tasks ";
    sql += "WHERE num = ?";

    DB.get(sql, num, function(err, row) {
        if (err) {
            console.log("An error occured when fetching from the database: " + err);
            return;
        } else {
            callback(row);
        };
    });
};

//using callback to avoid async operation issues
async function callback(row) {
    console.log("The Task is named: " + JSON.stringify(row.task_name));
    await row;
}



//MAIN FRAME, put your operations here and the program will execute them. yes i am too lazy to make a GUI or CLI.





//good practice to close after we're done
DB.close(function(err) {
    if (err) {
        console.log("An error occured when closing the database connection: " + err);
        return;
    } else {
        console.log('Disconnected from the database.');
    };
});