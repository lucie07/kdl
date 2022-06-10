const ActiveCollab = require("../src/activecollab");

jest.unmock("nock");
const nock = require("nock");

describe("ActiveCollab", () => {
  const API_URL = "https://example.com/api/v1";
  const API_TOKEN = "0123456789";

  let ac;

  beforeAll(() => {
    ac = new ActiveCollab(API_URL, API_TOKEN, 0);
  });

  describe("headers", () => {
    it("headers have authentication token", () => {
      expect(ac.headers["X-Angie-AuthApiToken"]).toBe(API_TOKEN);
    });
  });

  describe("get", () => {
    it("throws an error if no path is provided", async () => {
      await expect(ac.get()).rejects.toThrow();
    });

    it("throws a 404 if the path is not found", async () => {
      const path = "projects/1234";

      nock(API_URL).get(`/${path}`).reply(404);

      await expect(ac.get(path)).rejects.toThrowError("404");
    });

    it("throws a 500 if the path is invalid", async () => {
      const path = "doesnotexist";

      nock(API_URL).get(`/${path}`).reply(500);

      await expect(ac.get(path)).rejects.toThrowError("500");
    });

    it("returns a response", async () => {
      const path = "projects/1";

      nock(API_URL)
        .get(`/${path}`)
        .reply(200, { single: { id: 1 } });

      const response = await ac.get(path);
      expect(response.single.id).toBe(1);
    });

    it("is unaffected by unknown parameters", async () => {
      const path = "projects/1";

      nock(API_URL)
        .get(`/${path}?page=-1`)
        .reply(200, { single: { id: 1 } });

      const response = await ac.get(path, { page: -1 });
      expect(response.single.id).toBe(1);
    });
  });

  describe("company", () => {
    it("throws an error if no company id is given", async () => {
      await expect(ac.company()).rejects.toThrow();
    });

    it("throws and error if the company id is invalid", async () => {
      await expect(ac.company(-1)).rejects.toThrow();
      await expect(ac.company("1")).rejects.toThrow();
    });

    it("throws a 404 if the company is not found", async () => {
      const companyId = 9999;

      nock(API_URL).get(`/companies/${companyId}`).reply(404);

      await expect(ac.company(companyId)).rejects.toThrowError("404");
    });

    it("returns a company", async () => {
      const companyId = 1;

      nock(API_URL)
        .get(`/companies/${companyId}`)
        .reply(200, { single: { id: companyId } });

      const company = await ac.company(companyId);
      expect(company.id).toBe(companyId);
    });
  });

  describe("project", () => {
    it("throws an error if no project id is given", async () => {
      await expect(ac.project()).rejects.toThrow();
    });

    it("throws an error if the project id is invalid", async () => {
      await expect(ac.project("a")).rejects.toThrow();
      await expect(ac.project(0)).rejects.toThrow();
    });

    it("throws a 404 if the project is not found", async () => {
      const projectId = 9999;

      nock(API_URL).get(`/projects/${projectId}`).reply(404);

      await expect(ac.project(projectId)).rejects.toThrowError("404");
    });

    it("returns a project", async () => {
      const projectId = 1;

      nock(API_URL)
        .get(`/projects/${projectId}`)
        .reply(200, { single: { id: projectId } });

      const project = await ac.project(projectId);
      expect(project.id).toBe(1);
    });
  });

  describe("projects", () => {
    it("throws an error if the path is invalid", async () => {
      await expect(ac.projects({ projectId: 1 })).rejects.toThrow();
    });

    it("throws an error if params is not an object", async () => {
      await expect(ac.projects(1, 1)).rejects.toThrow();
    });

    it("throws a 404 if the path is not found", async () => {
      const path = "9999";

      nock(API_URL).get(`/projects/${path}`).reply(404);

      await expect(ac.projects(path)).rejects.toThrowError("404");
    });

    it("throws a 500 if the path is invalid", async () => {
      const path = "doesnotexist";

      nock(API_URL).get(`/projects/${path}`).reply(500);

      await expect(ac.projects(path)).rejects.toThrowError("500");
    });

    const response = [{ id: 1 }, { id: 2 }];

    it("returns multiple projects if no path is given", async () => {
      nock(API_URL).get("/projects/").reply(200, response);

      const projects = await ac.projects();
      expect(projects).toEqual(response);
    });

    it("returns multiple projects if the params are invalid", async () => {
      nock(API_URL).get("/projects/?page=-1").reply(200, response);

      const projects = await ac.projects("", { page: -1 });
      expect(projects).toEqual(response);
    });
  });

  describe("getProjectsList", () => {
    it("throws an error if no list name is given", async () => {
      await expect(ac.getProjectsList()).rejects.toThrow();
    });

    it("throws an error if the list name is invalid", async () => {
      await expect(ac.getProjectsList(1)).rejects.toThrow();
    });

    it("throws a 500 if the list name is invalid", async () => {
      const path = "doesnotexist";

      nock(API_URL).get(`/projects/${path}`).reply(500);

      await expect(ac.projects(path)).rejects.toThrowError("500");
    });

    it("returns a project list", async () => {
      const listName = "labels";

      nock(API_URL)
        .get("/projects/labels")
        .reply(200, [
          { id: 1, name: "one" },
          { id: 2, name: "two" },
        ]);

      const labels = await ac.getProjectsList(listName);
      expect(labels["1"]).toBe("one");
      expect(labels["2"]).toBe("two");
    });
  });

  describe("categories and labels", () => {
    const response = [
      { id: 1, name: "one" },
      { id: 2, name: "two" },
    ];

    it("returns categories", async () => {
      nock(API_URL).get("/projects/categories").reply(200, response);

      const names = await ac.categories();
      expect(names["1"]).toBe("one");
      expect(names["2"]).toBe("two");
    });

    it("returns labels", async () => {
      nock(API_URL).get("/projects/labels").reply(200, response);

      const names = await ac.labels();
      expect(names["1"]).toBe("one");
      expect(names["2"]).toBe("two");
    });
  });
});
