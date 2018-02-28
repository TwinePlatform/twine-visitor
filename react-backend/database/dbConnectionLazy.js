const pg = require('pg');

module.exports = (cfg) => new pg.Pool(cfg.psql);
