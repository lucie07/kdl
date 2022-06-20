const axios = require("axios");
const https = require("https");

class ActiveCollab {
  /**
   * @description Create a new ActiveCollab object.
   * @param {string} apiURL - The URL of the ActiveCollab API.
   * @param {string} apiToken - The API token to use for authentication.
   */
  constructor(apiURL, apiToken) {
    this.apiURL = apiURL;
    this.apiToken = apiToken;

    this.api = axios.create({
      baseURL: this.apiURL,
      headers: this.headers,
      httpsAgent: new https.Agent({ keepAlive: true }),
    });
  }

  /**
   * @description Get the headers to use for all requests.
   * @returns {Object}
   */
  get headers() {
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Angie-AuthApiToken": this.apiToken,
    };
  }

  /**
   * @description Do a GET request to the ActiveCollab API.
   * @param {string} path - The path to the GET request.
   * @param {Object} [params={}] - The parameters to send with the request.
   * @returns {Promise<Object>} The response data if successful, an error otherwise.
   */
  get(path, params = {}) {
    return new Promise((resolve, reject) => {
      if (!path) {
        reject(new Error("No path provided"));
      }

      this.api
        .get(path, {
          params,
        })
        .then((response) => resolve(response.data))
        .catch((err) => reject(err));
    });
  }

  /**
   * @description Get an ActiveCollab company.
   * @param {number} - The company id.
   * @return {Promise<Object>}
   */
  company(companyId) {
    if (!companyId) {
      return Promise.reject(new Error("No company id provided"));
    }

    if (typeof companyId !== "number" || companyId < 1) {
      return Promise.reject(new Error("Invalid company id"));
    }

    return this.get(`companies/${companyId}`)
      .then((data) => data.single)
      .catch((err) => Promise.reject(err));
  }

  /**
   * @description Get an ActiveCollab project.
   * @param {number} projectId - The ID of the project to get.
   * @returns {Promise<Object>}
   */
  project(projectId) {
    if (!projectId) {
      return Promise.reject(new Error("No project id provided"));
    }

    if (typeof projectId !== "number" || projectId < 1) {
      return Promise.reject(new Error("Project id must be a positive number"));
    }

    return this.projects(projectId)
      .then((data) => data.single)
      .catch((err) => Promise.reject(err));
  }

  /**
   * @description Get ActiveCollab projects or projects related data.
   * @param {number|string} [path=""] - The path to get, leave empty to get all projects.
   * @param {Object} [params={}] - The parameters to pass to the API request.
   * @returns {Promise<Object>|Promise<Array<Object>}
   */
  projects(path = "", params = {}) {
    if (typeof path !== "number" && typeof path !== "string") {
      return Promise.reject(new Error("Path must be a number or string"));
    }

    if (typeof params !== "object") {
      return Promise.reject(new Error("Params must be an object"));
    }

    return this.get(`projects/${path}`, params);
  }

  /**
   * @description Get an ActiveCollab list, for example for categories and labels, and
   * returns a map of ids as values and names as keys.
   * @param {string} listName - The name of the list to get.
   * @return {<Promise<Object>>}
   */
  getProjectsList(listName) {
    if (!listName) {
      return Promise.reject(new Error("No list name provided"));
    }

    if (typeof listName !== "string") {
      return Promise.reject(new Error("List name must be a string"));
    }

    return this.projects(listName)
      .then((data) => {
        return data.reduce(
          (obj, item) => ({ ...obj, [item.id]: item.name }),
          {}
        );
      })
      .catch((err) => Promise.reject(err));
  }

  /**
   * @description Get ActiveCollab project categories.
   * @return {Promise<Object>} An object with the categories ids as keys and the
   * names as values.
   */
  categories() {
    return this.getProjectsList("categories");
  }

  /**
   * @description Get ActiveCollab project labels.
   * @return {Promise<Object>} An object with the labels ids as keys and the
   * names as values.
   */
  labels() {
    return this.getProjectsList("labels");
  }
}

module.exports = ActiveCollab;
