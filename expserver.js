var express = require('express'),
    app = express();

//Listening on port 8090
app.listen(8090);


//Serve up static files public folder for use
app.use(express.static('./public'));

app.get('/', function(req, res) {
    res.sendfile("home.html");
});

app.post('/', function(req, res) {
    console.log(req.files);
    res.end("File Uploaded successfully");
});
