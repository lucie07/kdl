const markdownItImplicitFigures = require("markdown-it-implicit-figures");
const pluginEleventyNavigation = require("@11ty/eleventy-navigation");
const kdlFilters = require("kdl-components/src/kdl/filters");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItAttrs = require("markdown-it-attrs");
const pluginSEO = require("eleventy-plugin-seo");
const pluginTOC = require("eleventy-plugin-toc");
const { Directus } = require("@directus/sdk");
const markdownIt = require("markdown-it");
const { DateTime } = require("luxon");
const Nunjucks = require("nunjucks");
const path = require("node:path");
const sass = require("sass");

require("dotenv").config();

function getDirectus() {
  return new Directus(process.env.DIRECTUS_URL);
}

module.exports = (eleventyConfig) => {
  const kdlComponentsPath = "../node_modules/kdl-components/src";
  const nunjucksEnvironment = new Nunjucks.Environment([
    new Nunjucks.FileSystemLoader(kdlComponentsPath),
    new Nunjucks.FileSystemLoader("./src/_includes"),
  ]);
  eleventyConfig.setLibrary("njk", nunjucksEnvironment);
  eleventyConfig.addWatchTarget(kdlComponentsPath);

  eleventyConfig.setTemplateFormats(["html", "njk", "md"]);
  eleventyConfig.addPassthroughCopy({
    [`${kdlComponentsPath}/kdl/assets`]: "/assets",
    public: "/",
  });

  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  eleventyConfig.addPlugin(pluginEleventyNavigation);
  eleventyConfig.addPlugin(pluginSEO, require("./src/_data/config.js"));
  eleventyConfig.addPlugin(pluginTOC);

  eleventyConfig.setLibrary(
    "md",
    markdownIt()
      .use(markdownItAnchor)
      .use(markdownItAttrs)
      .use(markdownItImplicitFigures, { figcaption: true, copyAttrs: "class" })
  );

  eleventyConfig.addGlobalData("directus", getDirectus);
  eleventyConfig.addCollection("projectsByDate", function (collectionApi) {
    return [...collectionApi.getFilteredByTag("projects")].sort(
      (a, b) =>
        new Date(b.data.dissolutionDate) - new Date(a.data.dissolutionDate)
    );
  });

  eleventyConfig.addFilter("toLocaleDate", kdlFilters.toLocaleDate);
  eleventyConfig.addFilter("filter", kdlFilters.filter);
  eleventyConfig.addFilter("renderMd", kdlFilters.renderMd);

  eleventyConfig.addFilter("asProjectDate", (dateObj) => {
    if (!dateObj) {
      return "";
    }

    return DateTime.fromISO(dateObj).get("year");
  });

  eleventyConfig.addFilter("asToc", (content) => {
    const tocFilter = eleventyConfig.getFilter("toc");

    const toc = tocFilter(content);
    if (toc) {
      const items = toc.split("<li>");

      if (items.length > 2) {
        return toc;
      }
    }

    return undefined;
  });

  eleventyConfig.addFilter("featuredPosts", function (posts, number = 3) {
    return posts.reverse().slice(0, number);
  });

  eleventyConfig.addFilter(
    "featuredProjects",
    function (projects, status = "Active", number = 3) {
      return projects
        .filter((project) => project.creativeWorkStatus.name === status)
        .filter((project) => project.image)
        .filter(
          (project) => project.description && project.description.length > 0
        )
        .sort(() => Math.random() - 0.5)
        .slice(0, number);
    }
  );

  eleventyConfig.addFilter("fundedProjects", (projects, agent) => {
    if (!projects || !agent) return null;

    return projects.filter((project) => {
      return (
        project.funder &&
        project.funder.some(
          (funder) => funder?.agent_id?.id === agent?.agent?.id
        )
      );
    });
  });

  eleventyConfig.addFilter("partnerProjects", (projects, agent) => {
    if (!projects || !agent) return null;

    return projects.filter((project) => {
      return (
        project.department &&
        project.department.some(
          (department) =>
            department?.organisation_id?.agent?.id === agent?.agent?.id
        )
      );
    });
  });

  eleventyConfig.addFilter("getProjectMembers", (members) =>
    members.filter((member) => member.agent)
  );

  eleventyConfig.addFilter("getAgentProjects", (memberOf) =>
    memberOf.filter((role) => role.inProject)
  );

  eleventyConfig.addFilter("getAgentOrganisations", (memberOf) =>
    memberOf.filter((role) => role.inOrganisation)
  );

  eleventyConfig.addShortcode("getDirectusAsset", (id) => {
    if (!id) return null;
    return `${process.env.DIRECTUS_URL}/assets/${id}`;
  });

  eleventyConfig.addShortcode("route", function (path, navigationKey = "") {
    let url = path;

    if (navigationKey) {
      const graph = pluginEleventyNavigation.navigation.getDependencyGraph(
        this.ctx.collections.all
      );

      const found = graph.getNodeData(navigationKey);
      if (found) {
        url = `${found.url}${path}`;
      }
    }

    return url;
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
