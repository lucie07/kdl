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
      "agent.memberOf.inProject.alternateName",
      "agent.memberOf.inProject.slug",
      "agent.memberOf.inProject.foundingDate",
      "agent.memberOf.inProject.dissolutionDate",
      "agent.memberOf.inProject.department",
      "agent.memberOf.inProject.department.organisation_id.agent.name",
      "agent.memberOf.inOrganisation.agent.name",
      "agent.memberOf.inOrganisation.agent.slug",
    ],
    "agent.name"
  );
};
