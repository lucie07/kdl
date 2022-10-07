#!/usr/bin/env node

const ActiveCollab = require("./activecollab");
const Manager = require("./manager");
const Scraper = require("./scraper");
require("dotenv").config();

const { Directus } = require("@directus/sdk");
const { Command } = require("commander");
const pkg = require("../package.json");

async function cli() {
  const program = new Command();

  program
    .name(pkg.name)
    .description(pkg.description)
    .usage("<command> [options]")
    .version(pkg.version, "-v, --version");

  const projectsCommand = program
    .command("projects")
    .description("Manage project data");
  projectsCommand
    .command("import")
    .argument("<file>", "CSV projects list")
    .action((file) => {
      const activecollab = new ActiveCollab(
        process.env.AC_API_URL,
        process.env.AC_API_TOKEN
      );
      const directus = new Directus(process.env.DIRECTUS_URL);
      directus.auth
        .static(process.env.DIRECTUS_ACCESS_TOKEN)
        .then(() => console.group("Connected to Directus"))
        .then(() => directus.transport.post("/utils/cache/clear"))
        .then(() => console.info("Cleared Directus cache"))
        .catch((err) => Promise.reject(err));
      console.groupEnd();

      const manager = new Manager(activecollab, directus);
      manager
        .import(file)
        .then((projects) =>
          console.info(`Successfully imported ${projects.length} projects`)
        )
        .catch((err) => console.error(err));
    });

  const scrapeCommand = program
    .command("scrape")
    .description("Scrape content from the current web site");

  scrapeCommand
    .command("blog")
    .argument("<path>", "Path to save the blog posts")
    .action((path) => {
      const scraper = new Scraper("https://kdl.kcl.ac.uk/blog", path);
      scraper
        .scrape("*", scraper.getBlogData)
        .then(() => console.info("Blog scraping done"))
        .catch((err) => console.error(err));
    });

  scrapeCommand
    .command("faqs")
    .argument("<path>", "Path to save the faqs")
    .action((path) => {
      const scraper = new Scraper("https://kdl.kcl.ac.uk/how-we-work", path);
      scraper
        .scrape("faq-partners", scraper.getFaqData)
        .then(() => console.info("FAQs scraping done"))
        .catch((err) => console.error(err));
    });

  return program;
}

cli()
  .then((program) => program.parseAsync(process.argv))
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
