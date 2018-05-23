const morgan = require('morgan');
const chalk = require('chalk');

morgan.token('cb-name', (req) => req.auth.cb_name);
morgan.token('req-body', (req) => JSON.stringify(req.body));

const getColor = (status) =>
  status >= 500         // eslint-disable-line no-nested-ternary
    ? 'red'
    : status >= 400     // eslint-disable-line no-nested-ternary
      ? 'yellow'
      : status >= 300   // eslint-disable-line no-nested-ternary
        ? 'cyan'
        : 'green'
;


module.exports = morgan(
  (tokens, req, res) => {
    const status = tokens.status(req, res);
    const reset = chalk.reset;
    const color = chalk[getColor(status)] || chalk.reset;

    return [
      color(tokens.method(req, res).padEnd(7)),
      color(tokens.url(req, res).padEnd(30)),
      color(tokens.status(req, res)),
      reset(`${tokens['response-time'](req, res)}ms`.padStart(8)),
      reset('-'),
      reset(tokens['cb-name'](req, res)),
      reset(tokens['req-body'](req, res)),
      reset('-'),
      reset(tokens.res(req, res, 'content-length') || 'Empty response'),
    ].join(' ');
  }
);
