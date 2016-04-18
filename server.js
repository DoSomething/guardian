var express = require('express');
var path = require('path');
var compression = require('compression');
var favicon = require('serve-favicon');

import React from 'react'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import routes from './assets/js/routes'

var app = express();
app.use(compression());
app.use(express.static(path.join(__dirname, 'dist')))
console.log(path.join(__dirname,'dist','favicon.ico'));
app.use(favicon(path.join(__dirname,'dist','favicon.ico')));

app.get('*', (req, res) => {
  match({ routes: routes, location: req.url }, (err, redirect, props) => {
    if (err) {
      res.status(500).send(err.message);
    } 
    else if (redirect) {
      res.redirect(redirect.pathname + redirect.search)
    } else if (props) {
      const appHtml = renderToString(<RouterContext {...props}/>)
      res.send(renderPage(appHtml))
    } else {
      res.status(404).send('Not Found')
    }
  })
})

function renderPage(appHtml) {
  return `
    <!doctype html public "storage">
    <html>
      <head>
        <meta charset=utf-8 />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Guardian</title>
        <link rel="stylesheet" href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css' />
        <link rel="stylesheet" href="/index.css" />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
      </head>
      <body>
        <div id=app>${appHtml}</div>
        <script src="/bundle.js"></script>
      </body>
    </html>
   `;
}

var PORT = process.env.PORT || 4815;
app.listen(PORT, function() {
  console.log('DS Guardian server running at localhost:' + PORT);
})
