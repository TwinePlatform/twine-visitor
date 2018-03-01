# Testing Guide

## Testing Environment
The testing environment is composed of:
* `tape`: Test runner
* `supertest`: HTTP testing framework
* `nyc`: Coverage framework

## Resource Management in Testing
Some tests require external resources such as database connections. These resources should be explicitly managed within the test suite. A common pattern for doing this is to use "setup" and "teardown" functions. The "setup" function runs before tests in its suite, and creates any required resources. The tests then run, making use of these resources, and finally the "teardown" function runs, doing any required cleanup operations such as closing connections, running sanitising database queries, and so on.

1. Setup
2. Tests Run
3. Teardown

There are several small `tape` wrapper libraries that can provide this functionality to us, but its also simple to exploit the serial nature of the `tape` runner and simply use the following pattern:

```js
const test = require('tape');

test('<MODULE>', (tape) => {
  // Perform any setup actions, storing references to objects required by tests
  // e.g. const client = new pg.Client(config)
  // ...

  tape.test('<MODULE> | <TEST_NAME>', (t) => {
    // Run test, referring to variables defined above if necessary
    // ...
  });

  // More tests...
  // ...

  tape.test('<MODULE> | Teardown', (t) => {
    // After all other tests, place the teardown actions in this test
    // labelled "Teardown"
    // ...
  });
});
```
