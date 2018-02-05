const pg = {
  client: 'postgresql',
  connection: {
    host: process.env.PG_DB_HOST,
    user: process.env.PG_DB_USER,
    password: process.env.PG_DB_PASS,
    database: process.env.PG_DB_NAME
  },
  pool: {
    min: 2,
    max: 10
  }
};

module.exports = {
  test: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: './test/db.sqlite3'
    }
  },
  development: pg,
  production: pg
};
