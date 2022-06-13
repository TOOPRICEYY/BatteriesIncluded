const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'dbuser',
  password: 'dbuserpass',
  database: 'bigdata'
})

var dbStucture = {
    'Events' : {'Name':'TINYTEXT','DateTime':'DATETIME','EventType':'TINYTEXT','EventCategory':'TINYTEXT','EventData':'MEDIUMTEXT'} 
}

function query(str){
    return new Promise((resolve,reject)=>{connection.query(str, (err, rows, fields) => {
        if (err) throw err    
        resolve(rows)
    })})
}
function connect(){
    connection.connect()
}
function initializedb(){ // creates tables and rows if don't exists already
    function createTableStrGen(key,dict){
        str = `CREATE TABLE ${key} (`
        for (const [key2, value] of Object.entries(dict)) {
            str+=`${key2} ${value},`
        }
        str = str.slice(0,-1);
        str+=");";
        return str;   
    }
    return new Promise(async (resolve,reject)=>{
        for (const [key, value] of Object.entries(dbStucture)) {
            res = await query(`SHOW TABLES LIKE \'%${key}%\';`);
            if(res.length==0){// if table doesnt already exists
                await query(createTableStrGen(key,value));
            }else{
                let val_copy = structuredClone(value);
                res = await query(`SHOW COLUMNS FROM ${key};`);
                for(let x = 0; x<res.length; ++x){ //check all present columns
                    if(val_copy[res[x].Field]!==undefined){
                        if(val_copy[res[x].Field]!==(res[x].Type).toUpperCase()){ //if columns dont match expected type
                            reject(`DB column ${res[x].Field} in table ${key} doesnt have the expected type ${val_copy[res[x].Field]} found type ${res[x].Type}`);
                        }
                        delete val_copy[res[x].Field];
                    }
                }

                for (const [key2, value2] of Object.entries(val_copy)) { // itterate all columns not found but expected to be in sql
                    console.log(`Adding column ${key2} in table ${key}`);
                    query(`ALTER TABLE ${key} ADD ${key2} ${value2}`);
                }
            }
          }
        console.log("DB initialized")
        resolve("nothin")
    })   
}
function end(){
    connection.end()
}

class EventForms{
    constructor(){

    }
}

Date.prototype.getSQLFormat = function(){
    return (`${this.getFullYear()}-${this.getMonth()+1}-${this.getDate()} ${this.getHours()}:${this.getMinutes()}:${this.getSeconds()}`);
}

class Event{
    constructor(DateTime = new Date()){
        this._Forms = "new EventForms()";
        this._Cat = "";
        this._Type = "";
        this._Date = DateTime;
        this._Name =  "";
    }
    set Name(val){this._Name = val;}
    set Cat(val){this._Cat = val;}
    set Type(val){this._Type = val;}
    set Date(val){this._Date = val;}

    getName(){return this._Name}
    getDate(){return this._Date}
    getForms(){return this._Forms}
    getType(){return this._Type}
    getCat(){return this._Cat}

}

function addEvent(e){
return new Promise((resolve,reject)=>{
    query(`INSERT INTO Events (Name, DateTime, EventType, EventCategory, EventData) VALUES ("${e.getName()}", "${e.getDate().getSQLFormat()}", "${e.getType()}", "${e.getCat()}", ${JSON.stringify(e.getForms())});`)
})}

function pullEvents(){
    
}




module.exports = {
    connect:connect,
    initialize:initializedb,
    end:end,
    Event:Event,
    addEvent:addEvent,
    EventForms:EventForms,
  };