const express = require('express')
const app = express()
const port = 3000

const sqlmodels = require('./sql_models.js')
 
async function run(){
    sqlmodels.connect();
    await sqlmodels.initialize();
 
    let even = new sqlmodels.Event();
    even.Name = "NAME!!!"
    even.Cat = "CUTE CAT"
    even.Type = "APPLE"

    sqlmodels.addEvent(even);

    sqlmodels.end()
}

run();

/*
app.get('/', (req, res) => {
    
})

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

function shutDown() {
    console.log("THIS IS A MESSAGE")
    sql_models.close();
    server.close(() => {
        console.log('Closed out remaining connections');
        process.exit(0);
    });
}
*/