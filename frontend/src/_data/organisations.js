const helpers = require("./_helpers");

module.exports = async ({ directus }) => {
  return helpers.loadData(
    directus,
    "organisation",
    "organisations",
    "agent.name"
  );
};
