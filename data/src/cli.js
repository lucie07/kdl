#!/usr/bin/env node

const ActiveCollab = require("./activecollab");
const ProjectImporter = require("./project");
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

  const projectsCommand = program.command("projects");
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
        .then(() => console.info("Connected to Directus"))
        .catch((err) => Promise.reject(err));

      const importer = new ProjectImporter(activecollab, directus);
      importer
        .import(file)
        .then((results) => {
          if (results.fulfilled.length > 0) {
            console.info(
              `Successfully imported ${results.fulfilled.length} projects`
            );
          }
          if (results.rejected.length > 0) {
            console.warn(
              `Failed to import ${results.rejected.length} projects`
            );
            console.group();
            results.rejected.forEach((result) => {
              console.group(result.reason.parent.config.data);
              console.error(result.reason.errors[0].message);
              console.groupEnd();
            });
            console.groupEnd();
          }
        })
        .catch((err) => console.error(err));
    });

  return program;
}

cli()
  .then((program) => program.parseAsync(process.argv))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
