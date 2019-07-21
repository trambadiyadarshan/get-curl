# get-curl

Simple but effective, this `ExpressJS` middleware prints out the equivalent curl command. Typically this would be used as a utility for backend developers for replicating requests that may be causing problems.

### Installation

Install the package by running the command below, from the root of your NodeJS project.

`npm install --save get-curl`

### Usage

1. Include the package in your ExpressJS app along with other dependencies.

```
const fs = require('fs');
const express = require('express');

// Include get-curl as a dependency
const { expressCurl } = require('get-curl');

let app = express();
...
```

2. Declare this as a middleware just above the route definitions

```
app.use(bodyParser.json());
...

// Include the express curl middleware
app.use(expressCurl);

...
app.use('/auth', authRouter);
app.use('/users', usersRouter);
```

Now the `stdout` will print the curl.

### Customise the middleware

To customise the middleware, you can require `expressCurlMiddlewareFactory` instead (Note: to use this module as in v1, require `expressCurl`):

```
const { expressCurlMiddlewareFactory } = require('@darshan/express-curl');

app.use(expressCurlMiddlewareFactory({
    // Logs the request as a curl command using logFn.
    // Default: true
    log: true,
    // The function to use to log the curl command.
    // Default: console.log
    logFn: console.log,
    // Attaches the curl command as a string to express's `req` for access by other middleware.
    // Default: true
    attachToReq: true,
    // The express `req`'s field name to which to assign the curl command as a string.
    // Default: 'asCurlStr'
    strName: 'asCurlStr',
}));

app.use((req, res, next) => {
    console.log('I have access to asCurlStr:', req.asCurlStr);
})
```

If you're fine with the defaults:

```
const { expressCurlMiddlewareFactory } = require('get-curl');

app.use(expressCurlMiddlewareFactory());
```

### A note on requiring expressCurl

This:

```
const { expressCurl } = require('get-curl');

app.use(expressCurl);
```

Is the same as:

```
const { expressCurlMiddlewareFactory } = require('get-curl');

app.use(expressCurlMiddlewareFactory(
    attachToReq: false,
));
```
