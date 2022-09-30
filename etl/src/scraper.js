const { CheerioCrawler } = require("crawlee");
const download = require("image-downloader");
const Turndown = require("turndown");
const fs = require("fs/promises");
const path = require("path");
const YAML = require("yaml");

class Scraper {
  constructor(url, outputPath) {
    this.url = url;
    this.outputPath = path.resolve(outputPath);
    this.imagesPath = path.join(this.outputPath, "images");

    console.log(this.imagesPath);

    Promise.resolve(fs.mkdir(this.imagesPath, { recursive: true }));
  }

  scrape(glob, getDataCallback = this.getBlogData) {
    return new Promise((resolve, reject) => {
      const self = this;

      const crawler = new CheerioCrawler({
        async requestHandler({ request, $, enqueueLinks, log }) {
          log.info(request.url);

          const name = request.url.split("/").at(-2);
          const data = getDataCallback($);

          const images = [];
          $(".main img").each((_, img) => images.push($(img).attr("src")));
          self.downloadImages(images);

          self.save(name, data);

          await enqueueLinks({
            globs: [`${self.url}/${glob}`],
          });
        },
      });

      crawler
        .addRequests([this.url])
        .then(() => crawler.run())
        .then(() => resolve())
        .catch((err) => reject(err));
    });
  }

  getBlogData($) {
    const data = { frontmatter: {}, html: null };

    const tags = ["post"];
    $(".tags a").each((_, el) => tags.push($(el).text()));

    data.frontmatter.layout = "layouts/post.njk";
    data.frontmatter.title = $("h1").text().trim();
    data.frontmatter.tags = tags;
    data.frontmatter.author = $(".author").text().trim();
    data.frontmatter.date = $(".datetime").attr("datetime");
    data.frontmatter.excerpt = $(".intro").text();

    const banner = $(".banner-image img").attr("src");
    if (banner) {
      data.frontmatter.banner = banner;
    }

    const html = [];
    $("article.post")
      .children(":not(.post-meta):not(.intro)")
      .each((_, el) => html.push($(el).html()));

    const td = Turndown({
      headingStyle: "atx",
      bulletListMarker: "-",
      emDelimiter: "*",
    });
    data.md = td.turndown(html.join("\n"));

    return data;
  }

  downloadImages(images) {
    images.forEach((image) => {
      if (image) {
        download
          .image({
            url: `https://kdl.kcl.ac.uk${image}`,
            dest: this.imagesPath,
          })
          .catch((err) => console.error(err));
      }
    });
  }

  save(name, data) {
    const content = ["---"];
    content.push(YAML.stringify(data.frontmatter).trim());
    content.push("---\n");
    content.push(data.md);

    fs.writeFile(
      `${this.outputPath}/${name}.md`,
      content.join("\n").replaceAll("/static/media", "")
    );
  }
}

module.exports = Scraper;
