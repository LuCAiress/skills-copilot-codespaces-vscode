// Create web server
// 1. Import http module
const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const template = require('./lib/template.js');
const path = require('path');

// 2. Create server
const app = http.createServer((req, res) => {
    const _url = req.url;
    const queryData = url.parse(_url, true).query;
    const pathName = url.parse(_url, true).pathname;

    if (pathName === '/') {
        if (queryData.id === undefined) {
            fs.readdir('./data', (err, fileList) => {
                const title = 'Welcome';
                const description = 'Hello, Node.js';
                const list = template.list(fileList);
                const html = template.html(title, list, `<h2>${title}</h2>${description}`, `<a href="/create">create</a>`);
                res.writeHead(200);
                res.end(html);
            });
        } else {
            fs.readdir('./data', (err, fileList) => {
                const filteredId = path.parse(queryData.id).base;
                fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
                    const title = queryData.id;
                    const sanitizedTitle = path.parse(title).base;
                    const list = template.list(fileList);
                    const html = template.html(title, list, `<h2>${sanitizedTitle}</h2>${description}`, `
                    <a href="/create">create</a>
                    <a href="/update?id=${sanitizedTitle}">update</a>
                    <form action="delete_process" method="post">
                        <input type="hidden" name="id" value="${sanitizedTitle}">
                        <input type="submit" value="delete">
                    </form>
                    `);
                    res.writeHead(200);
                    res.end(html);
                });
            });
        }
    } else if (pathName === '/create') {
        fs.readdir('./data', (err, fileList) => {
            const title = 'WEB - create';
            const list = template.list(fileList);
            const html = template.html(title, list, `
            <form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p><textarea name="description" placeholder