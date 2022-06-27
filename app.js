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

    await sqlmodels.addEvent(even);

    //await sqlmodels.removeAllEvents();

    await sqlmodels.pullEvents();

}

//run();

app.use('/',express.static('site_root'))

//app.get('/', (req, res) => {})

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

function shutDown() {
    console.log("Gracefully Shutting Down")
    sqlmodels.end();
    server.close(() => {
        console.log('Closed out remaining connections');
        process.exit(0);
    });
}
