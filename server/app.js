const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const axios = require('axios')
const csv = require('csvtojson')
const csvtojsonV2 = require("csvtojson/v2");
const jsonFile = require('../server/datalog.json');
//const stringify = require('csv-stringify').stringify
const fs = require('fs');
const app = express();


// set counter for middleware
var count = 0; 

//apply middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
// write your logging code here
//log every request to server
// log Agent,Time,Method,Resource,Version,Status values to log.csv
//store user -Agent  value in to var agent and reformat it to remove commas
count++
let agent = req.header("user-agent");
let time = new Date().toISOString();
let method = req.method;
let resource= req.originalUrl;
let version= req.httpVersion;
let status= res.statusCode;
let data = [agent, time, method, resource, "HTTP/" + version,status]

fs.appendFile('./server/log.csv', "\n"+data.join(";"), (err) => {
    if (err) {
      console.log(err);
    }})

console.log(data.join(";"));
console.log("This is Agent info: ", agent);
console.log("ln32 csv file: ", fs.readFileSync('log.csv', "utf8"))
console.log("this is the time: ",time)
});

app.get('/', (req, res) => {
// write your code to respond "ok" here
// return 200 status code with OK 

res.status(200).json({"status":'ok'}); 
});

app.get('/logs', (req, res) => {
    //the end point that does not require authentication
// write your code to return a json object containing the log data here
//reference csv file and convert to json object and re

const csvFilePath = './server/log.csv'
csv()
.fromFile(csvFilePath)
.then((jsonFile)=>{
    console.log(jsonFile);
})

//const jsonArry=await csv().fromFile(csvFilePath);


});

module.exports = app;
