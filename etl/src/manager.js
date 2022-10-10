const extractUrls = require("extract-urls");
const { parse } = require("csv-parse");
const { DateTime } = require("luxon");
const slugify = require("slugify");
const _ = require("lodash");
const fs = require("fs");

class Manager {
  constructor(activecollab, directus) {
    this.activecollab = activecollab;
    this.directus = directus;
    this.slugs = {};
  }

  /**
   * @description Import projects into Directus from the given CSV file and from the
   * given ActiveCollab API.
   * @returns {Promise<Array<Object>>} An array of the imported projects.
   */
  import(filePath) {
    return new Promise((resolve, reject) => {
      this.parse(filePath)
        .then((projects) => this.prepare(projects))
        .then((projects) => this.hydrate(projects))
        .then((projects) => this.create(projects))
        .then((projects) => resolve(projects))
        .catch((err) => reject(err));
    });
  }

  /**
   * @description Parse the projects file and return an array of objects.
   * @returns {Promise<Array<Object>>}
   */
  parse(filePath) {
    return new Promise((resolve, reject) => {
      if (!filePath) {
        reject(new Error("No file path provided"));
      }

      const projects = [];

      const parser = parse({ columns: true, delimiter: "," });
      const readStream = fs.createReadStream(filePath);
      readStream.on("error", (err) => reject(err));

      readStream.pipe(parser);

      parser
        .on("readable", () => {
          let project;
          while ((project = parser.read()) !== null) {
            projects.push(project);
          }
        })
        .on("end", () => resolve(projects))
        .on("error", (err) => reject(err));
    });
  }

  /**
   * @description Prepare the projects for import, convert fields to map the data model.
   * @param {Array<Object>} projects - An array of projects
   * @returns {Promise<Array<Object>>}
   */
  prepare(projects) {
    return new Promise((resolve, reject) => {
      if (!projects || projects.length === 0) {
        reject(new Error("No projects provided"));
      }

      projects = projects
        .filter((project) => project["Project ID"] !== undefined)
        .filter(
          (project) => project["Add to KDL Website"].toLowerCase() === "yes"
        )
        .map((project) => ({
          activecollabId: parseInt(project["Project ID"]),
          name: project.Title,
          alternateName: project.Acronym,
          foundingDate: this.getDate(project["Project Start Date"]),
          dissolutionDate: this.getDate(project["Project End Date"]),
          description: project["Project Description"],
          pi: this.parseList(project.PI).map((pi) => this.parseMember(pi)),
          researchers: this.parseList(project["Other Project Team"]).map((r) =>
            this.parseMember(r)
          ),
          funder: this.parseList(project.Funder),
          team: this.parseList(project["KDL Project Team"]),
          url: this.getURLs(project, ["Project URL", "GitHub URL"]),
        }));

      resolve(projects);
    });
  }

  getDate(string) {
    if (!string || string.length === 0) {
      return null;
    }

    return DateTime.fromFormat(string, "dd/mm/yyyy").toISODate();
  }

  parseList(string) {
    if (!string) {
      return [];
    }

    return string
      .split(",")
      .map((name) => name.trim().replace(/[[\]"]/g, ""))
      .filter((name) => name.length > 0);
  }

  parseMember(member) {
    if (!member) return;

    const parts = member.split("(");
    const org = parts[1] ? parts[1].replace(")", "") : "Unknown organisation";

    return { name: parts[0].trim(), org: org };
  }

  getURLs(project, columns) {
    return columns
      .map((c) => ({
        name: c,
        values: extractUrls(project[c].replaceAll("&%2358;", ":")),
      }))
      .filter((url) => url.values)
      .map((url) => ({ name: url.name, values: [...new Set(url.values)] }))
      .flatMap((url) =>
        url.values.map((value) => ({
          name: this.getURLName(url.name, value),
          url: value,
        }))
      );
  }

  getURLName(name, url) {
    if (name === "Project URL") {
      return name;
    }

    return `Repository: ${url.split("/").slice(3).join("/")}`;
  }

  /**
   * @description Hydrate the projects with ActiveCollab data.
   * @param {Array<Object>} projects - An array of projects.
   * @returns {Array<Promise<Object>>} An array of promises.
   */
  hydrate(projects) {
    return new Promise((resolve, reject) => {
      if (!projects || projects.length === 0) {
        reject(new Error("No projects provided"));
      }

      Promise.all([this.activecollab.categories(), this.activecollab.labels()])
        .then(([categories, labels]) => {
          const promises = [];

          projects.forEach((project) =>
            promises.push(this.hydrateProject(project, categories, labels))
          );

          return Promise.allSettled(promises);
        })
        .then((results) => {
          results
            .filter((result) => result.status === "rejected")
            .forEach((result) => {
              console.group(result.reason.config.url);
              console.error(result.reason.message);
              console.groupEnd();
            });
          resolve(
            results
              .filter((result) => result.status === "fulfilled")
              .map((result) => result.value)
          );
        })
        .catch((err) => reject(err));
    });
  }

  /**
   * @description Hydrate a project with ActiveCollab data.
   * @param {Object} project - A project.
   * @param {Object} categories - An object with categories.
   * @param {Object} labels - An object with labels.
   * @returns {Promise<Object>}
   */
  hydrateProject(project, categories, labels) {
    return new Promise((resolve, reject) => {
      if (!project || !categories || !labels) {
        reject(new Error("No project, categories or labels provided"));
      }

      this.activecollab
        .project(project.activecollabId)
        .then((acProject) =>
          resolve({
            ...project,
            name: acProject.name,
            slug: this.getSlug(project.acronym ?? acProject.name.split(":")[0]),
            creativeWorkStatus: this.getCreativeWorkStatus(
              labels[acProject.label_id]
            ),
          })
        )
        .catch((err) => reject(err));
    });
  }

  /**
   * @description Generate a slug for a project name.
   * @param {String} name - The name of the project.
   * @returns {String}
   */
  getSlug(name) {
    if (!name) {
      return "";
    }

    let slug = slugify(name, { remove: /[#*+~.,()'"!:@]/g, lower: true });

    if (this.slugs[slug] !== undefined) {
      this.slugs[slug] += 1;
      slug = `${slug}-${this.slugs[slug]}`;
    } else {
      this.slugs[slug] = 1;
    }

    return slug;
  }

  getCreativeWorkStatus(label) {
    switch (label.toLowerCase()) {
      case "foundations":
      case "evolutionary development":
        return "Active";
      case "post-project":
        return "Maintained";
      default:
        return "Post-project";
    }
  }

  /**
   * @description Create the projects in Directus
   * @param {Array<Object>} projects - An array of projects
   * @returns {Array<Promise<Object>>} - An array of promises
   */
  async create(projects) {
    const definedTermSet = await this.getOrCreateDrfinedTermSet();

    const creativeWorkStatuses = [
      ...new Set(projects.map((project) => project.creativeWorkStatus)),
    ];
    const definedTerms = await this.getOrCreateDefinedTerms(
      definedTermSet,
      creativeWorkStatuses
    );

    const piNames = _.uniqWith(
      projects
        .flatMap((project) => project.pi)
        .map((pi) => ({ name: pi.name })),
      _.isEqual
    );
    const piPersonAgents = await this.getOrCreateAgents("person", piNames);

    const piOrganisations = _.uniqWith(
      projects
        .flatMap((project) => project.pi)
        .map((pi) => ({
          name: pi.org,
        })),
      _.isEqual
    );
    const piOrganisationAgents = await this.getOrCreateAgents(
      "organisation",
      piOrganisations
    );

    const researchersNames = _.uniqWith(
      projects
        .flatMap((project) => project.researchers)
        .filter((r) => r.name.length > 0)
        .map((r) => ({ name: r.name })),
      _.isEqual
    );
    const researchersPersonAgents = await this.getOrCreateAgents(
      "person",
      researchersNames
    );

    const researchersOrganisations = _.uniqWith(
      projects
        .flatMap((project) => project.researchers)
        .map((r) => ({
          name: r.org,
        })),
      _.isEqual
    );
    const researchersOrganisationAgents = await this.getOrCreateAgents(
      "organisation",
      researchersOrganisations
    );

    const funderNames = _.uniqWith(
      projects
        .flatMap((project) => project.funder)
        .filter((name) => name.length > 0)
        .map((name) => ({ name: name })),
      _.isEqual
    );
    const funderAgents = await this.getOrCreateAgents(
      "organisation",
      funderNames
    );

    const teamNames = [
      ...new Set(projects.flatMap((project) => project.team)),
    ].map((name) => ({ name: name }));
    const teamAgents = await this.getOrCreateAgents("person", teamNames);

    const urls = projects
      .map((project) => project.url)
      .filter((url) => url.length > 0);
    const urlRoles = await this.getOrCreateLinkRoles("linkrole", urls);

    return await this.getOrCreateProjects(
      projects,
      definedTerms,
      piPersonAgents,
      piOrganisationAgents,
      researchersPersonAgents,
      researchersOrganisationAgents,
      funderAgents,
      teamAgents,
      urlRoles
    );
  }

  getOrCreateDrfinedTermSet(name = "SDLC") {
    const filter = { name: name };
    return this.getOrCreateItem("definedtermset", filter, filter);
  }

  /**
   * @description Ger or create an item from/in a Directus collection.
   * @param {String} collection - The collection name.
   * @param {Object} filter - The filter to use to find the item, a key/value object
   * with the key being the field name and the value being the value to match.
   * @param {Object} data - The data to use to create the item.
   * @returns {Promise<Object>}
   */
  async getOrCreateItem(collection, filter, data) {
    const items = this.directus.items(collection);

    let response = await items.readByQuery({
      filter: this.getQueryFilter(filter),
    });

    if (response && response.data && response.data.length > 0) {
      return response.data[0];
    }

    response = await items.createOne(data);

    return response;
  }

  /**
   * @description Convert a key/value object to a Directus query filter.
   * @param {Object} filter - The filter to convert.
   * @returns {Object}
   */
  getQueryFilter(filter) {
    if (!filter || typeof filter !== "object") {
      return {};
    }

    return Object.keys(filter)
      .map((key) => ({
        [key]: { _eq: filter[key] },
      }))
      .reduce(
        (obj, item) => ({
          ...obj,
          [Object.keys(item)[0]]: Object.values(item)[0],
        }),
        {}
      );
  }

  async getOrCreateDefinedTerms(definedTermSet, names) {
    const definedTerms = {};

    for (const name of names) {
      const filter = {
        name: name,
        inDefinedTermSet: definedTermSet.id,
      };
      const definedTerm = await this.getOrCreateItem(
        "definedterm",
        filter,
        filter
      );

      definedTerms[name] = definedTerm;
    }

    return definedTerms;
  }

  async getOrCreateAgents(collection, names) {
    const agents = {};

    for (const item of names) {
      const filter = { name: item.name };
      let data = { ...filter, slug: this.getSlug(filter.name) };

      if (item.related) {
        const relatedFilter = { name: item.related.name };
        const related = await this.getOrCreateAgent(collection, relatedFilter, {
          ...relatedFilter,
          slug: this.getSlug(relatedFilter.name),
        });

        data = { ...data, [item.related.relationship]: related.id };
      }

      const agent = await this.getOrCreateAgent(collection, filter, data);

      agents[item.name] = agent;
    }

    return agents;
  }

  async getOrCreateAgent(collection, filter, data) {
    const agent = await this.getOrCreateItem("agent", filter, data);

    filter = { agent: agent.id };
    return await this.getOrCreateItem(collection, filter, {
      ...filter,
      ...data,
    });
  }

  async getOrCreateLinkRoles(collection, values) {
    const roles = {};

    for (const value of values) {
      for (const item of value) {
        const role = await this.getOrCreateItem(collection, item, item);

        roles[item.url] = role;
      }
    }

    return roles;
  }

  async getOrCreateProjects(
    projects,
    definedTerms,
    piPersonAgents,
    piOrganisationAgents,
    researchersPersonAgents,
    researchersOrganisationAgents,
    funders,
    teams,
    urls
  ) {
    const data = [];

    for (const project of projects) {
      data.push(
        await this.getOrCreateProject(
          project,
          definedTerms,
          piPersonAgents,
          piOrganisationAgents,
          researchersPersonAgents,
          researchersOrganisationAgents,
          funders,
          teams,
          urls
        )
      );
    }

    return data;
  }

  async getOrCreateProject(
    project,
    definedTerms,
    piPersonAgents,
    piOrganisationAgents,
    researchersPersonAgents,
    researchersOrganisationAgents,
    funders,
    teams,
    urls
  ) {
    const members = [];

    project.pi.forEach((pi) =>
      members.push({
        name: "Principal investigator",
        agent: piPersonAgents[pi.name].agent,
        inOrganisation: piOrganisationAgents[pi.org].id,
      })
    );

    project.researchers
      .filter((r) => researchersPersonAgents[r.name] !== undefined)
      .forEach((r) =>
        members.push({
          name: "Researcher",
          agent: researchersPersonAgents[r.name].agent,
          inOrganisation: researchersOrganisationAgents[r.org].id,
        })
      );

    project.team.forEach((person) => {
      if (teams[person]) {
        members.push({ name: "RSE team member", agent: teams[person].agent });
      }
    });

    const departments = [];

    _.uniq(project.pi.map((pi) => pi.org)).forEach((org) =>
      departments.push({
        organisation_id: { id: piOrganisationAgents[org].id },
      })
    );

    const fundersData = [];
    project.funder
      .filter((funder) => funders[funder] !== undefined)
      .forEach((funder) =>
        fundersData.push({ agent_id: { id: funders[funder].agent } })
      );

    const linkRoles = [];
    project.url
      .filter((url) => urls[url.url] !== undefined)
      .forEach((url) =>
        linkRoles.push({ linkrole_id: { id: urls[url.url].id } })
      );

    const filter = { name: project.name };
    const data = {
      name: project.name,
      alternateName: project.alternateName,
      slug: project.slug,
      foundingDate: project.foundingDate,
      dissolutionDate: project.dissolutionDate,
      description: project.description,
      creativeWorkStatus: definedTerms[project.creativeWorkStatus]
        ? definedTerms[project.creativeWorkStatus].id
        : null,
      funder: fundersData,
      department: departments,
      member: members,
      url: linkRoles,
    };

    return await this.getOrCreateItem("project", filter, data);
  }
}

module.exports = Manager;
