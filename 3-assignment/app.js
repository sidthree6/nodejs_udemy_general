const http = require('http');
const fs = require('fs');

// Create a server
const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        res.write('<body>');
        res.write('<p>Welcome to my NodeJS Api to create a user.</p>');
        res.write('<ul>');
        res.write('<li>To view users go to "/users" route</li>');
        res.write('</ul>');
        res.write('<form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">Create User</button></form>');
        res.write('</body>');
        res.write('</html>');
        return res.end();
    }
    if (url === '/users') {
        // Read users.txt file
        fs.readFile('users.txt', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                // Split the users by comma
                const users = data.toString().split(',');
                res.write('<html>');
                res.write('<head><title>Users</title></head>');
                res.write('<body>');
                res.write('<p>Users:</p>');
                res.write('<ul>');
                // Loop through the users and display them
                users.forEach(user => {
                    if (user) {
                        res.write('<li>' + user + '</li>');
                    }
                });
                res.write('</ul>');
                res.write('</body>');
                res.write('</html>');
                return res.end();
            }
        });
    }
    if (url === '/create-user' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
        });
        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1] + ",";
            // Append the user to the users.txt file
            fs.appendFile('users.txt', message, (err) => {
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            });
        });
    }
});

server.listen(port = 3000);