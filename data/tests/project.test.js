const ActiveCollab = require("../src/activecollab");
const ProjectImporter = require("../src/project");
const { Directus } = require("@directus/sdk");

jest.unmock("nock");
const nock = require("nock");

describe("ProjectImporter", () => {
  const AC_API_URL = "https://ac.local/api/v1";
  const AC_API_TOKEN = "0123456789";
  const DIRECTUS_API_URL = "https://directus.local/";
  const DIRECTUS_API_TOKEN = "0123456789";

  let ac;
  let directus;
  let importer;

  beforeAll(() => {
    ac = new ActiveCollab(AC_API_URL, AC_API_TOKEN, 0);

    nock(DIRECTUS_API_URL)
      .get(`/users/me?access_token=${DIRECTUS_API_TOKEN}`)
      .reply(200);
    directus = new Directus(DIRECTUS_API_URL);
    directus.auth
      .static(DIRECTUS_API_TOKEN)
      .then(() => {})
      .catch((err) => Promise.reject(err));

    importer = new ProjectImporter(ac, directus);
  });

  describe("parse", () => {
    it("throws an error if no file is given", async () => {
      await expect(importer.parse()).rejects.toThrowError();
    });

    it("throws an error if the file is not found", async () => {
      await expect(
        importer.parse("./tests/not-found.csv")
      ).rejects.toThrowError("EN");
    });

    it("parses the file and returns an array", async () => {
      const projectData = await importer.parse("./tests/projects.csv");
      expect(projectData).toBeDefined();
      expect(projectData.length).toBeGreaterThan(0);
    });
  });

  describe("prepare", () => {
    it("throws an error if no projects are given", async () => {
      await expect(importer.prepare()).rejects.toThrowError();
    });

    it("throws an error if the projects are empty", async () => {
      await expect(importer.prepare([])).rejects.toThrowError();
    });

    it("transforms the projects discarding invalid ones", async () => {
      const rawProjects = [
        {
          "Project ID": 1,
          Title: "Title 1",
          PI: "PI 1",
          Funder: "Funder 1",
          Other: "field",
        },
        {
          "Project ID": 2,
          Title: "Title 2",
          PI: "PI 2",
          Funder: "Funder 2",
          Other: "field",
        },
        {
          Title: "Undefined Project ID",
          PI: "PI 3",
          Funder: "Funder 3",
          Other: "field",
        },
      ];

      const projects = await importer.prepare(rawProjects);
      expect(projects).toBeDefined();
      expect(projects.length).toBeGreaterThan(0);
      expect(projects[0].name).toBeDefined();
    });
  });

  describe("hydrate", () => {
    it("throws an error if no projects are given", async () => {
      await expect(importer.hydrate()).rejects.toThrowError();
    });

    it("throws an error if the projects are empty", async () => {
      await expect(importer.hydrate([])).rejects.toThrowError();
    });

    it("throws an error if it can't get categories or labels", async () => {
      const preparedProjects = [
        {
          activecollabId: 1,
          name: "Title 1",
          pi: "PI 1",
          funder: "Funder 1",
        },
        {
          activecollabId: 2,
          name: "Title 2",
          pi: "PI 2",
          funder: "Funder 2",
        },
      ];

      nock(AC_API_URL).get("/projects/categories").reply(404);
      await expect(importer.hydrate(preparedProjects)).rejects.toThrowError();

      nock(AC_API_URL).get("/projects/categories").reply(200, []);
      nock(AC_API_URL).get("/projects/labels").reply(404);
      await expect(importer.hydrate(preparedProjects)).rejects.toThrowError();
    });

    it("hydrates the projects", async () => {
      const preparedProjects = [
        {
          activecollabId: 1,
          name: "Title 1",
          pi: "PI 1",
          funder: "Funder 1",
        },
        {
          activecollabId: 2,
          name: "Title 2",
          pi: "PI 2",
          funder: "Funder 2",
        },
      ];

      preparedProjects.forEach((project) => {
        nock(AC_API_URL)
          .get(`/projects/${project.activecollabId}`)
          .reply(200, {
            single: {
              id: project.activecollabId,
              name: `Project name ${project.activecollabId}`,
              company_id: project.activecollabId,
            },
          });
        nock(AC_API_URL)
          .get(`/companies/${project.activecollabId}`)
          .reply(200, {
            single: {
              id: project.activecollabId,
              name: `Company name ${project.activecollabId}`,
            },
          });
      });

      const authorityList = [
        { id: 1, name: "one" },
        { id: 2, name: "two" },
      ];
      nock(AC_API_URL).get("/projects/categories").reply(200, authorityList);
      nock(AC_API_URL)
        .get("/projects/labels")
        .reply(
          200,
          authorityList.map((a) => ({ ...a, id: a.id * 2 }))
        );

      const projects = await importer.hydrate(preparedProjects);
      expect(projects).toBeDefined();
      expect(projects.length).toBeGreaterThan(0);
    });
  });

  describe("hydrateProject", () => {
    const project = {
      activecollabId: 1,
      name: "Title 1",
      pi: "PI 1",
      funder: "Funder 1",
    };

    it("throws an error if no projects, categories or labels are given", async () => {
      await expect(importer.hydrateProject()).rejects.toThrowError();
      await expect(importer.hydrateProject(project)).rejects.toThrowError();
      await expect(importer.hydrateProject(project, {})).rejects.toThrowError();
    });

    it("throws an error if the project is not found", async () => {
      nock(AC_API_URL).get(`/projects/${project.activecollabId}`).reply(404);
      await expect(
        importer.hydrateProject(project, {}, {})
      ).rejects.toThrowError();
    });

    it("throws an error if the company is not found", async () => {
      nock(AC_API_URL)
        .get(`/projects/${project.activecollabId}`)
        .reply(200, {
          single: {
            id: project.activecollabId,
            name: `Project name ${project.activecollabId}`,
            company_id: project.activecollabId,
          },
        });
      nock(AC_API_URL).get(`/companies/${project.activecollabId}`).reply(404);
      await expect(
        importer.hydrateProject(project, {}, {})
      ).rejects.toThrowError();
    });

    it("hydrates the project", async () => {
      nock(AC_API_URL)
        .get(`/projects/${project.activecollabId}`)
        .reply(200, {
          single: {
            id: project.activecollabId,
            name: `Project name ${project.activecollabId}`,
            company_id: project.activecollabId,
          },
        });
      nock(AC_API_URL)
        .get(`/companies/${project.activecollabId}`)
        .reply(200, {
          single: {
            id: project.activecollabId,
            name: `Company name ${project.activecollabId}`,
          },
        });

      const hydrated = await importer.hydrateProject(project, {}, {});
      expect(hydrated).toBeDefined();
      expect(hydrated.department).toEqual(
        `Company name ${project.activecollabId}`
      );
    });
  });

  describe("create", () => {
    //const project = {
    //activecollabId: 1,
    //name: "Project name 1",
    //pi: "PI 1",
    //funder: "Funder 1",
    //creativeWorkStatus: "Foundations",
    //department: "Company: department name 1",
    //};

    it("throws an error if no projects are given", async () => {
      await expect(importer.create()).rejects.toThrowError();
    });
  });

  describe("getOrCreateItem", () => {
    it("throws an error if no collection, filter or data are given", async () => {
      await expect(importer.getOrCreateItem()).rejects.toThrowError();
      await expect(
        importer.getOrCreateItem("collection")
      ).rejects.toThrowError();
      await expect(
        importer.getOrCreateItem("collection", {})
      ).rejects.toThrowError();
    });

    it("throws an error if no valid parameters are given", async () => {
      await expect(importer.getOrCreateItem("", {}, {})).rejects.toThrowError();
      await expect(
        importer.getOrCreateItem("collection", {}, {})
      ).rejects.toThrowError();
      await expect(
        importer.getOrCreateItem("collection", { name: "name" }, {})
      ).rejects.toThrowError();
    });

    it("throws an error if the collection is not found", async () => {
      const collection = "notfound";
      const filter = { name: "name" };
      nock(DIRECTUS_API_URL)
        .get(
          `/items/${collection}?filter=${JSON.stringify(
            importer.getQueryFilter(filter)
          )}`
        )
        .reply(403);

      await expect(
        importer.getOrCreateItem(collection, filter, filter)
      ).rejects.toThrowError("403");
    });

    it("throws an error if the item already exists", async () => {
      const collection = "collection";
      const filter = { name: "name" };

      nock(DIRECTUS_API_URL)
        .get(
          `/items/${collection}?filter=${JSON.stringify(
            importer.getQueryFilter(filter)
          )}`
        )
        .reply(200, { data: [] });
      nock(DIRECTUS_API_URL).post(`/items/${collection}`).reply(400);

      await expect(
        importer.getOrCreateItem(collection, filter, filter)
      ).rejects.toThrowError("400");
    });

    it("gets the item if it exists", async () => {
      const collection = "collection";
      const filter = { name: "name" };

      nock(DIRECTUS_API_URL)
        .get(
          `/items/${collection}?filter=${JSON.stringify(
            importer.getQueryFilter(filter)
          )}`
        )
        .reply(200, { data: [{ id: 1, name: filter.name }] });

      const item = await importer.getOrCreateItem(collection, filter, { x: 1 });
      expect(item).toBeDefined();
      expect(item.name).toEqual(filter.name);
    });

    it("creates the item if it doesn't exist", async () => {
      const collection = "collection";
      const filter = { name: "name" };

      nock(DIRECTUS_API_URL)
        .get(
          `/items/${collection}?filter=${JSON.stringify(
            importer.getQueryFilter(filter)
          )}`
        )
        .reply(200, { data: [] });
      nock(DIRECTUS_API_URL)
        .post(`/items/${collection}`)
        .reply(200, { data: { id: 1, name: filter.name } });

      const item = await importer.getOrCreateItem(collection, filter, filter);
      expect(item).toBeDefined();
      expect(item.name).toEqual(filter.name);
    });
  });

  describe("getQueryFilter", () => {
    it("returns an emppty object if no filter is given", async () => {
      expect(importer.getQueryFilter()).toEqual({});
    });

    it("returns and empty object if the filter is not an object", async () => {
      expect(importer.getQueryFilter("")).toEqual({});
    });

    it("returns a query filter", async () => {
      const filter = { name: "name" };
      const queryFilter = importer.getQueryFilter(filter);
      expect(queryFilter).toBeDefined();
      expect(queryFilter).toEqual({ name: { _eq: filter.name } });
    });
  });

  describe("getOrCreateAgent", () => {
    it("throws an error if no parameters  given", async () => {
      await expect(importer.getOrCreateAgent()).rejects.toThrowError();
      await expect(importer.getOrCreateAgent("name")).rejects.toThrowError();
      await expect(
        importer.getOrCreateAgent("name", "type")
      ).rejects.toThrowError();
      await expect(
        importer.getOrCreateAgent("name", "type", {})
      ).rejects.toThrowError();
    });

    it("throws an error if no valid parameters are given", async () => {
      await expect(
        importer.getOrCreateAgent("", "type", { a: 1 }, { b: 2 })
      ).rejects.toThrowError();
      await expect(
        importer.getOrCreateAgent(1, "type", { a: 1 }, { b: 2 })
      ).rejects.toThrowError();
      await expect(
        importer.getOrCreateAgent("name", "", { a: 1 }, { b: 2 })
      ).rejects.toThrowError();
      await expect(
        importer.getOrCreateAgent("name", 2, { a: 1 }, { b: 2 })
      ).rejects.toThrowError();
      await expect(
        importer.getOrCreateAgent("name", "type", {}, { b: 2 })
      ).rejects.toThrowError();
      await expect(
        importer.getOrCreateAgent("name", "type", 1, { b: 2 })
      ).rejects.toThrowError();
      await expect(
        importer.getOrCreateAgent("name", "type", { a: 1 }, {})
      ).rejects.toThrowError();
      await expect(
        importer.getOrCreateAgent("name", "type", { a: 1 }, "data")
      ).rejects.toThrowError();
    });

    it("gets the agent if it exists", async () => {
      const collection = "person";
      const filter = { name: "name" };

      nock(DIRECTUS_API_URL)
        .get(
          `/items/agent?filter=${JSON.stringify(
            importer.getQueryFilter(filter)
          )}`
        )
        .reply(200, { data: [{ id: 1, name: filter.name }] });
      nock(DIRECTUS_API_URL)
        .get(
          `/items/${collection}?filter=${JSON.stringify(
            importer.getQueryFilter({ agent: 1 })
          )}`
        )
        .reply(200, { data: [{ id: 1, name: filter.name }] });

      const item = await importer.getOrCreateAgent(
        filter.name,
        collection,
        filter,
        { x: 1 }
      );
      expect(item).toBeDefined();
      expect(item.name).toEqual(filter.name);
    });

    it("creates the agent if it doesn't exist", async () => {
      const collection = "person";
      const filter = { name: "name" };

      nock(DIRECTUS_API_URL)
        .get(
          `/items/agent?filter=${JSON.stringify(
            importer.getQueryFilter(filter)
          )}`
        )
        .reply(200, { data: [] });
      nock(DIRECTUS_API_URL)
        .post("/items/agent")
        .reply(200, { data: { id: 1, name: filter.name } });
      nock(DIRECTUS_API_URL)
        .get(
          `/items/${collection}?filter=${JSON.stringify(
            importer.getQueryFilter({ agent: 1 })
          )}`
        )
        .reply(200, { data: [] });
      nock(DIRECTUS_API_URL)
        .post(`/items/${collection}`)
        .reply(200, { data: { id: 1, name: filter.name } });

      const item = await importer.getOrCreateAgent(
        filter.name,
        collection,
        filter,
        { x: 1 }
      );
      expect(item).toBeDefined();
      expect(item.name).toEqual(filter.name);
    });
  });

  describe("getOrCreateDepartment", () => {
    it("it throws an error if no name is given", async () => {
      await expect(importer.getOrCreateDepartment()).rejects.toThrowError();
    });

    it("it throws an error if the name is invalid", async () => {
      await expect(importer.getOrCreateDepartment("")).rejects.toThrowError();
      await expect(importer.getOrCreateDepartment(1)).rejects.toThrowError();
    });

    it("gets or creates the parent organisation if the name doesn't have a `:``", async () => {
      const filter = { name: "name" };

      nock(DIRECTUS_API_URL)
        .get(
          `/items/agent?filter=${JSON.stringify(
            importer.getQueryFilter(filter)
          )}`
        )
        .reply(200, { data: [{ id: 1, name: filter.name }] });
      nock(DIRECTUS_API_URL)
        .get(
          `/items/organisation?filter=${JSON.stringify(
            importer.getQueryFilter({ agent: 1 })
          )}`
        )
        .reply(200, { data: [{ id: 1, name: filter.name }] });

      const item = await importer.getOrCreateDepartment(filter.name);
      expect(item).toBeDefined();
      expect(item.name).toEqual(filter.name);
    });

    it("gets or creates a parent organisation and sub-organisation", async () => {
      const name = "parent: sub";
      nock(DIRECTUS_API_URL)
        .get(
          `/items/agent?filter=${JSON.stringify(
            importer.getQueryFilter({ name: "parent" })
          )}`
        )
        .reply(200, { data: [{ id: 1, name: "parent" }] });
      nock(DIRECTUS_API_URL)
        .get(
          `/items/organisation?filter=${JSON.stringify(
            importer.getQueryFilter({ agent: 1 })
          )}`
        )
        .reply(200, { data: [{ id: 1, name: "parent" }] });

      nock(DIRECTUS_API_URL)
        .get(
          `/items/agent?filter=${JSON.stringify(
            importer.getQueryFilter({ name: "sub" })
          )}`
        )
        .reply(200, { data: [{ id: 2, name: "sub" }] });
      nock(DIRECTUS_API_URL)
        .get(
          `/items/organisation?filter=${JSON.stringify(
            importer.getQueryFilter({ agent: 2 })
          )}`
        )
        .reply(200, { data: [{ id: 2, name: "sub" }] });

      const item = await importer.getOrCreateDepartment(name);
      expect(item).toBeDefined();
      expect(item.name).toEqual("sub");
    });
  });
});
