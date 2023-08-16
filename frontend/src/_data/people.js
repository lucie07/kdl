const helpers = require("./_helpers");

const callback = (data) =>
  data.map((d) => {
    const orgs = d.agent.memberOf
      .filter((m) => m.inOrganisation?.agent.name === "King's Digital Lab")
      .map((m) => ({
        role: m.roleName.name,
        startYear: m.startDate ? new Date(m.startDate).getFullYear() : null,
        endYear: m.endDate ? new Date(m.endDate).getFullYear() : null,
      }));

    return { memberOfKDL: orgs, ...d };
  });

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
      "agent.memberOf.roleName.name",
      "agent.memberOf.startDate",
      "agent.memberOf.endDate",
    ],
    "agent.name",
    callback
  );
};
