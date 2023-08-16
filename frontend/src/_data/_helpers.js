const fs = require("fs/promises");

module.exports = {
  async loadData(
    directus,
    collection,
    fileName,
    fields,
    sort = "name",
    callback = null
  ) {
    return fs
      .readFile(`./src/_data/_${fileName}.json`)
      .then((data) => JSON.parse(data))
      .then((data) => Promise.resolve(data))
      .catch((err) => {
        console.warn(`${err.message}, using Directus instead`);

        return directus
          .items(collection)
          .readByQuery({ fields: fields, sort: sort, limit: -1 })
          .then((response) => response.data)
          .then((data) => (callback ? callback(data) : data))
          .then((data) => {
            fs.writeFile(
              `./src/_data/_${fileName}.json`,
              JSON.stringify(data, null, 2)
            );

            return Promise.resolve(data);
          })
          .catch((err) => console.error(err));
      });
  },
};
