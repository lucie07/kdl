const helpers = require("./_helpers");

module.exports = async ({ directus }) => {
  return helpers.loadData(
    directus,
    "person",
    "people",
    [
      "jobTitle",
      "agent.name",
      "agent.slug",
      "agent.description",
      "agent.memberOf.name",
      "agent.memberOf.inProject.name",
      "agent.memberOf.inProject.slug",
      "agent.memberOf.inOrganisation.agent.name",
      "agent.memberOf.inOrganisation.agent.slug",
    ],
    "agent.name"
  );
};
