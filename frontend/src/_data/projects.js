const helpers = require("./_helpers");

module.exports = async ({ directus }) => {
  return helpers.loadData(directus, "project", "projects", ["*.*.*.*.*"]);
};
