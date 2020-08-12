// start.js
const app = require('./server.js')
app.listen(8081, listening);

// Callback to debug
function listening(){
    console.log(`JH Travel App now running on port 8081`);
  };