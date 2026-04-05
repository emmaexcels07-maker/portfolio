const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;
const publicDir = path.resolve(__dirname);

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain',
};

const server = http.createServer((req, res) => {
    const requestUrl = req.url.split('?')[0];
    let filePath = path.join(publicDir, requestUrl === '/' ? 'index.html' : requestUrl);

    if (!filePath.startsWith(publicDir)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not found');
            return;
        }

        if (stats.isDirectory()) {
            filePath = path.join(filePath, 'index.html');
        }

        fs.readFile(filePath, (readErr, data) => {
            if (readErr) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server error');
                return;
            }

            const ext = path.extname(filePath).toLowerCase();
            res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
            res.end(data);
        });
    });
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
