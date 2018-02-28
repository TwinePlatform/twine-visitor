const build = require('./build')
const destroy = require('./destroy')
const populate = require('./populate')


const refresh = async () => {
  await destroy();
  await build();
  await populate();
}


module.exports = refresh;


if (require.main === module) { // Invoked from command line
  const env = process.env.NODE_ENV;

  refresh()
    .then(() => console.log(`Database refreshed using "${env}" configuration`))
    .catch((e) => {
      console.error(`Database could not be refreshed using "${env}" configuration`);
      console.error(e);
    });
}
