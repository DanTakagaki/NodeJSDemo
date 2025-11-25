//Deprecated in favor of express.js middleware in app.js

const fs = require('fs');

const requestHandler = (req, res) => {
    console.log(req.url, req.method, req.headers);
    const url = req.url;
    const method = req.method;

    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        res.write('<body><form action="/create-user" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
        res.write('</html>');
        return res.end();
    }
    if (url === '/create-user' && method === 'POST') {
        //Buffering data
        const body = [];
        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);

        });
        req.on('end', () => {
            const parseBody = Buffer.concat(body).toString();
            const message = parseBody.split('=')[1];
            // fs.writeFile('message.txt', message, err => {
            //     res.statusCode = 302;
            //     res.setHeader('Location', '/');
            //     return res.end();
            // });
            fs.appendFile('message.txt', message + '\n', (err) => {
                if (err) {
                    console.error('Errorwriting file: ', err);
                    res.statusCode = 500;
                    return res.end();
                }

                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end()
            });
        });
        return;
    }

    res.setHeader('Content-Type', 'text/html')
    res.write('<html>');
    res.write('<head><title>My First Page</title></head>');
    res.write('<body><h1>Hello Taka</h1></body>');
    res.write('<html>');
    res.end();
};

exports.handler = requestHandler;