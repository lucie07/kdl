const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const pluginSEO = require("eleventy-plugin-seo");
const { Directus } = require("@directus/sdk");
const { DateTime } = require("luxon");
const path = require("node:path");
const sass = require("sass");

require("dotenv").config();

function getDirectus() {
  return new Directus(process.env.DIRECTUS_URL);
}

module.exports = (eleventyConfig) => {
  eleventyConfig.setTemplateFormats(["html", "njk", "md"]);
  eleventyConfig.addPassthroughCopy({ public: "/" });

  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(pluginSEO, require("./src/_data/seo.json"));

  eleventyConfig.addGlobalData("directus", getDirectus);

  eleventyConfig.addShortcode("getAssetURL", (id) => {
    if (!id) return null;

    return `${process.env.DIRECTUS_URL}/assets/${id}`;
  });

  eleventyConfig.addFilter("asPostDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });

  eleventyConfig.addFilter("asProjectDate", (dateObj) => {
    if (!dateObj) {
      return "";
    }

    return DateTime.fromISO(dateObj).get("year");
  });

  eleventyConfig.addFilter("fundedProjects", (projects, funder) => {
    if (!projects || !funder) return null;

    return projects.filter((project) =>
      project.funder.some((funded) => funded.agent_id.id === funder.agent.id)
    );
  });

  eleventyConfig.addShortcode("route", function (path, navigationKey = "") {
    const urlFilter = eleventyConfig.getFilter("url");

    let url = path;

    if (navigationKey) {
      const graph = eleventyNavigationPlugin.navigation.getDependencyGraph(
        this.ctx.collections.all
      );

      const found = graph.getNodeData(navigationKey);
      if (found) {
        url = `${found.url}${path}`;
      }
    }

    return urlFilter(url);
  });

  // https://www.11ty.dev/docs/languages/custom/#example-add-sass-support-to-eleventy
  eleventyConfig.addTemplateFormats("scss");
  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",
    style: "compressed",
    compile: async function (inputContent, inputPath) {
      const parsed = path.parse(inputPath);
      const result = sass.compileString(inputContent, {
        loadPaths: [parsed.dir || ".", this.config.dir.includes],
      });

      return (_) => {
        return result.css;
      };
    },
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site",
    },
  };
};
