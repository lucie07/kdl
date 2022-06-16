module.exports = async ({ directus }) => {
  return directus
    .items("project")
    .readByQuery({ fields: ["*.*.*"], sort: "name", limit: -1 })
    .then((response) => response.data)
    .catch((error) => console.log(error));
};
