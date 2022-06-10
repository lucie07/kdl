const { parse } = require("csv-parse");
const fs = require("fs");

class ProjectImporter {
  constructor(activecollab, directus) {
    this.activecollab = activecollab;
    this.directus = directus;
  }

  /**
   * @description Import projects into Directus from the given CSV file and from the
   * given ActiveCollab API.
   * @returns {Promise<Object>} An object containing the results of the import.
   */
  import(filePath) {
    return new Promise((resolve, reject) => {
      this.parse(filePath)
        .then((projects) => this.prepare(projects))
        .then((projects) => this.hydrate(projects))
        .then((projects) => this.create(projects))
        .then((results) =>
          resolve({
            fulfilled: results.filter(
              (result) => result.status === "fulfilled"
            ),
            rejected: results.filter((result) => result.status === "rejected"),
          })
        )
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
        .map((project) => ({
          activecollabId: parseInt(project["Project ID"]),
          name: project.Title,
          pi: project.PI,
          funder: project.Funder,
        }));

      resolve(projects);
    });
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
            creativeWorkStatus: labels[acProject.label_id],
            department: acCompany.name,
          })
        )
        .catch((err) => reject(err));
    });
  }

  /**
   * @description Import the projects into Directus
   * @param {Array<Object>} projects - An array of projects
   * @returns {Array<Promise<Object>>} - An array of promises
   */
  create(projects) {
    return new Promise((resolve, reject) => {
      if (!projects || projects.length === 0) {
        reject(new Error("No projects provided"));
      }

      const promises = [];
      projects
        .filter((project) =>
          ["foundations", "evolutionary development"].includes(
            project.creativeWorkStatus.toLowerCase()
          )
        )
        .forEach((project) => promises.push(this.createProject(project)));

      Promise.allSettled(promises)
        .then((results) => resolve(results))
        .catch((err) => reject(err));
    });
  }

  /**
   * @description Create a project in Directus.
   * @param {Object} project - A project.
   * @returns {Promise<Object>}
   */
  createProject(project) {
    return new Promise((resolve, reject) => {
      if (!project) {
        reject(new Error("No project provided"));
      }

      if (typeof project !== "object" || Object.keys(project).length === 0) {
        reject(new Error("Invalid project provided"));
      }

      let filter = { name: "SDLC" };
      const definedTermPromise = this.getOrCreateItem(
        "definedtermset",
        filter,
        filter
      ).then((obj) => {
        filter = { name: project.creativeWorkStatus };
        return this.getOrCreateItem("definedterm", filter, {
          ...filter,
          inDefinedTermSet: obj.id,
        });
      });

      let piPromise = null;
      if (project.pi) {
        filter = { name: project.pi };
        piPromise = this.getOrCreateAgent(project.pi, "person", filter, filter);
      }

      let funderPromise = null;
      if (project.funder) {
        filter = { name: project.funder };
        funderPromise = this.getOrCreateAgent(
          project.funder,
          "organisation",
          filter,
          filter
        );
      }

      let departmentPromise = null;
      if (project.department) {
        departmentPromise = this.getOrCreateDepartment(project.department);
      }

      Promise.all([
        definedTermPromise,
        departmentPromise,
        funderPromise,
        piPromise,
      ])
        .then(([definedTerm, department, funder, pi]) => {
          filter = { name: project.name };
          this.getOrCreateItem("project", filter, {
            ...filter,
            creativeWorkStatus: definedTerm.id,
            department: department ? department.id : null,
            funder: funder ? [{ agent_id: { id: funder.agent } }] : [],
            member: pi
              ? [{ name: "Principal investigator", agent: pi.agent }]
              : [],
          });
        })
        .then((obj) => resolve(obj))
        .catch((err) => reject(err));
    });
  }

  /**
   * @description Ger or create an item from/in a Directus collection.
   * @param {String} collection - The collection name.
   * @param {Object} filter - The filter to use to find the item, a key/value object
   * with the key being the field name and the value being the value to match.
   * @param {Object} data - The data to use to create the item.
   * @returns {Promise<Object>}
   */
  getOrCreateItem(collection, filter, data) {
    return new Promise((resolve, reject) => {
      if (!collection || !filter || !data) {
        reject(new Error("No collection, filter or data provided"));
      }

      if (typeof collection !== "string" || collection.length === 0) {
        reject(new Error("No valid collection provided"));
      }

      if (typeof filter !== "object" || Object.keys(filter).length === 0) {
        reject(new Error("No valid filter provided"));
      }

      if (typeof data !== "object" || Object.keys(data).length === 0) {
        reject(new Error("No valid data provided"));
      }

      const items = this.directus.items(collection);
      items
        .readByQuery({
          filter: this.getQueryFilter(filter),
        })
        .then((response) =>
          response.data.length > 0 ? response.data[0] : items.createOne(data)
        )
        .then((response) => resolve(response))
        .catch((err) => reject(err));
    });
  }

  getQueryFilter(filter) {
    if (!filter || typeof filter !== "object") {
      return {};
    }

    return Object.keys(filter).map((key) => ({
      [key]: { _eq: filter[key] },
    }))[0];
  }

  getOrCreateAgent(name, type, filter, data) {
    if (!name || !type || !filter || !data) {
      return Promise.reject(
        new Error("No name, type, filter or data provided")
      );
    }

    return this.getOrCreateItem("agent", filter, data).then((obj) => {
      filter = { agent: obj.id };
      return this.getOrCreateItem(type, filter, { ...filter, ...data });
    });
  }

  getOrCreateDepartment(name) {
    if (!name) {
      return Promise.reject(new Error("No name, filter or data provided"));
    }

    let [company, department] = name.split(":");
    company = company.trim();

    let filter = { name: company };
    const companyPromise = this.getOrCreateAgent(
      company,
      "organisation",
      filter,
      filter
    );

    if (!department) {
      return companyPromise;
    }

    department = department.trim();
    return companyPromise.then((company) => {
      filter = { name: department };
      return this.getOrCreateAgent(department, "organisation", filter, {
        ...filter,
        parentOrganisation: company.id,
      });
    });
  }
}

module.exports = ProjectImporter;
