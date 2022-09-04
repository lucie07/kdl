const fs = require("fs/promises");

module.exports = {
  async loadData(directus, collection, fileName, sort = "name") {
    return fs
      .readFile(`./src/_data/_${fileName}.json`)
      .then((data) => JSON.parse(data))
      .then((projects) => Promise.resolve(projects))
      .catch((err) => {
        console.warn(`${err.message}, using Directus instead`);

        return directus
          .items(collection)
          .readByQuery({ fields: ["*.*.*.*"], sort: sort, limit: -1 })
          .then((response) => response.data)
          .then((projects) => {
            fs.writeFile(
              `./src/_data/_${fileName}.json`,
              JSON.stringify(projects, null, 2)
            );

            return Promise.resolve(projects);
          })
          .catch((err) => console.error(err));
      });
  },
};
