const extractUrls = require("extract-urls");
const { parse } = require("csv-parse");
const slugify = require("slugify");
const _ = require("lodash");
const fs = require("fs");

class Manager {
  constructor(activecollab, directus) {
    this.activecollab = activecollab;
    this.directus = directus;
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
          description: project["Project Description"],
          pi: project.PI,
          funder: project.Funder,
          team: this.parseList(project["KDL Project Team"]),
          url: this.getURLs(project, ["Project URL", "GitHub URL"]),
        }));

      resolve(projects);
    });
  }

  parseList(string) {
    if (!string) {
      return [];
    }

    return string
      .split(",")
      .map((name) => name.trim().replace(/[\[\]\"]/g, "")) // eslint-disable-line
      .filter((name) => name.length > 0);
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
        url.values.map((value) => ({ name: url.name, url: value }))
      );
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

      const acProjectPromise = this.activecollab.project(
        project.activecollabId
      );
      const acCompanyPromise = acProjectPromise.then((acProject) =>
        this.activecollab.company(acProject.company_id)
      );
      Promise.all([acProjectPromise, acCompanyPromise])
        .then(([acProject, acCompany]) =>
          resolve({
            ...project,
            name: acProject.name,
            slug: this.getSlug(acProject.name),
            creativeWorkStatus: labels[acProject.label_id],
            department: this.getDepartment(acCompany.name),
          })
        )
        .catch((err) => reject(err));
    });
  }

  getDepartment(name) {
    let [company, department] = name.split(":");
    company = company.trim();

    if (department) {
      department = department.trim();
    }

    return {
      name: department,
      related: { name: company, relationship: "parentOrganisation" },
    };
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

    return slugify(name, { remove: /[*+~.,()'"!:@]/g, lower: true });
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

    const piNames = [...new Set(projects.map((project) => project.pi))]
      .filter((name) => name.length > 0)
      .map((name) => ({ name: name }));
    const piAgents = await this.getOrCreateAgents("person", piNames);

    const funderNames = [...new Set(projects.map((project) => project.funder))]
      .filter((name) => name.length > 0)
      .map((name) => ({ name: name }));
    const funderAgents = await this.getOrCreateAgents(
      "organisation",
      funderNames
    );

    const teamNames = [
      ...new Set(projects.flatMap((project) => project.team)),
    ].map((name) => ({ name: name }));
    const teamAgents = await this.getOrCreateAgents("person", teamNames);

    const departments = _.uniqWith(
      projects.map((project) => project.department),
      _.isEqual
    );
    const departmentAgents = await this.getOrCreateAgents(
      "organisation",
      departments
    );

    const urls = projects
      .map((project) => project.url)
      .filter((url) => url.length > 0);
    const urlRoles = await this.getOrCreateLinkRoles("linkrole", urls);

    return await this.getOrCreateProjects(
      projects,
      definedTerms,
      piAgents,
      funderAgents,
      teamAgents,
      departmentAgents,
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
      let data = filter;

      if (item.related) {
        const relatedFilter = { name: item.related.name };
        const related = await this.getOrCreateAgent(
          collection,
          relatedFilter,
          relatedFilter
        );

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
    pis,
    funders,
    teams,
    departments,
    urls
  ) {
    const data = [];

    for (const project of projects) {
      data.push(
        await this.getOrCreateProject(
          project,
          definedTerms,
          pis,
          funders,
          teams,
          departments,
          urls
        )
      );
    }

    return data;
  }

  async getOrCreateProject(
    project,
    definedTerms,
    pis,
    funders,
    teams,
    departments,
    urls
  ) {
    const members = [];

    if (pis[project.pi]) {
      members.push({
        name: "Principal investigator",
        agent: pis[project.pi].agent,
      });
    }

    project.team.forEach((person) => {
      if (teams[person]) {
        members.push({ name: "KDL member", agent: teams[person].agent });
      }
    });

    console.log(urls);
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
      description: project.description,
      creativeWorkStatus: definedTerms[project.creativeWorkStatus]
        ? definedTerms[project.creativeWorkStatus].id
        : null,
      funder: funders[project.funder]
        ? [{ agent_id: { id: funders[project.funder].agent } }]
        : null,
      department: departments[project.department.name]
        ? departments[project.department.name].id
        : null,
      member: members,
      url: linkRoles,
    };

    return await this.getOrCreateItem("project", filter, data);
  }
}

module.exports = Manager;
