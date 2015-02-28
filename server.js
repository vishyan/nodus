var http= require('http')
    , fs= require('fs')
    , path= require('path')
    , formidable = require('formidable')
    , util = require('util')
    , url = require('url')
    , gzip = require('zlib').createGzip();

var env = {port: 8090, host: '127.0.0.1'};

//Simple http server
var httpServer = http.createServer(function(req, res) {
    var contextPath = url.parse(req.url).pathname;
    if (contextPath == '/' || contextPath == '/public') {
        routePage(req, res);
        return;
    }
    if(contextPath.indexOf('/upload') === 0 && req.method.toUpperCase() == 'POST') {
        uploadFile(req, res);
        return;
    }
    if(contextPath.indexOf('/download') === 0 && req.method.toUpperCase() == 'GET') {
        downloadFile(req, res);
        return;
    }
});

httpServer.listen(env.port);
console.log('Server is running on port 8090');

function routePage(req, res) {
    //Trying to render static content from hard-coded public folder
    var contextPath = url.parse(req.url).pathname;
    if(contextPath == '/') {
        contextPath = 'home.html';
    } else {
        contextPath = "/public"+contextPath;
    }
    var filePath = path.join(process.cwd(), contextPath);

    fs.exists(filePath, function(exists) {
        if(!exists) {
            res.writeHeader(404, {"Content-Type": "text/plain"});
            res.end("Gosh.. File not found :( ");
        } else {
            fs.readFile(filePath, "binary", function(err, file) {
                if(err) {
                    res.writeHeader(500,{"Content-Type":"text/plain"});
                    res.end("We hit a BUMP....SORRY" + err+"\n");
                } else {
                    res.writeHeader(200);
                    res.write(file, "binary");
                    res.end();
                }
            })
        }
    })
};

function uploadFile(req, res) {
    //Uploading FIle
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var writeStream = fs.createWriteStream('./output/output.txt');

        // This pipes the POST data to the file
        req.pipe(gzip).pipe(writeStream);
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('received upload:\n\n');
        res.end(util.inspect({fields: fields, files: files, status:'FILE UPLOADED SUCCESSFULLY'}));

         /* Alternate way for writing streams
         writeStream.on('data', function(data) {
         writeStream.write(data);
         });
         writeStream.on('end', function() {
         writeStream.end();
         });
         writeStream.on('error', function(data) {
         console.log('Error and something wrong..');
         writeStream.close();
         });
         */

    }); // End of Form Parse and Upload
};

function downloadFile(req, res) {
    //Downloading File
    console.log('Started Download File Processing');
    var ctxPath = url.parse(req.url).pathname;
    ctxPath = ctxPath.slice('/download'.length, ctxPath.length);

    var filePath = "./download"+ctxPath;
    fs.exists(filePath, function(exists) {
        if(exists) {
            console.log('File Found. Yay !!');
            var fileMetaData = fs.statSync(filePath);
            res.writeHead(200, {
                'Content-Type': 'text/plain',
                'Content-Type': fileMetaData.size
            });

            var readStream = fs.createReadStream(filePath, {encoding: 'utf8'});
            readStream.pipe(gzip).pipe(res);
        } else {
            res.writeHead(404);
            res.write(filePath+"Not Found");
            res.end();
        }
    });

    /* Alternate way for reading streams
    readStream.on('data', function(data) {
        console.log('loading file data......');
    });

    readStream.on('end', function() {
        console.log('File Data load - Complete');
    });

    readStream.on('error', function(err) {
        console.log('Error and something wrong..');
    });
    */

};

function uploadFileAndWrite(req, res) {
    //Uploading FIle
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var writeStream = fs.createWriteStream('./output/output.txt');

        // This pipes the POST data to the file
        req.pipe(writeStream);

        writeStream.on('data', function(data) {
            writeStream.write(data);
        });
        writeStream.on('end', function() {
            writeStream.end();
        });
        writeStream.on('error', function(data) {
            console.log('Error and something wrong..');
            writeStream.close();
        });

        // After all the data is saved, respond with a simple html form so they can post more data
        req.on('end', function () {
            res.writeHead(200, {"content-type":"text/html"});
            res.end('<form method="POST"><input name="test" /><input type="submit"></form>');
        });
//        res.end(util.inspect({fields: fields, files: files, status:'FILE UPLOADED SUCCESSFULLY'}));
    });

    res.end("File Uploaded successfully");
};
