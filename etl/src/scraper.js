const { CheerioCrawler } = require("crawlee");
const download = require("image-downloader");
const Turndown = require("turndown");
const slugify = require("slugify");
const fs = require("fs/promises");
const path = require("path");
const YAML = require("yaml");

class Scraper {
  constructor(url, outputPath) {
    this.url = url;
    this.outputPath = path.resolve(outputPath);
    this.imagesPath = path.join(this.outputPath, "images");

    Promise.resolve(fs.mkdir(this.imagesPath, { recursive: true }));

    this.turndown = Turndown({
      headingStyle: "atx",
      bulletListMarker: "-",
      emDelimiter: "*",
    });
  }

  scrape(glob, getDataCallback) {
    return new Promise((resolve, reject) => {
      const self = this;

      const crawler = new CheerioCrawler({
        async requestHandler({ request, $, enqueueLinks, log }) {
          log.info(request.url);

          const name = request.url.split("/").at(-2);
          const data = getDataCallback(self, $);

          const images = [];
          $(".main img").each((_, img) => images.push($(img).attr("src")));
          self.downloadImages(images);

          if (data instanceof Array) {
            data.forEach((d) => self.save(d.name, d, d.path));
          } else {
            self.save(name, data);
          }

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

  getBlogData(scraper, $) {
    const data = { frontmatter: {}, html: null };

    const tags = ["post"];
    $(".tags a").each((_, el) => tags.push($(el).text()));

    data.frontmatter.title = $(".subtitle").text().trim();
    data.frontmatter.subtitle = $(".subtitle").next("h1").text().trim();
    data.frontmatter.tags = tags;
    data.frontmatter.authors = [$(".author").text().trim()];
    data.frontmatter.date = $(".datetime").attr("datetime");
    data.frontmatter.excerpt = $(".intro").text();

    const banner = $(".banner-image img");
    if (banner) {
      data.frontmatter.feature = {};
      data.frontmatter.feature.image = banner.attr("src");
      data.frontmatter.feature.description = banner.attr("alt");
    }

    const html = [];
    $("article.post")
      .children(":not(.post-meta)")
      .each((_, el) => html.push($(el)));

    data.md = scraper.turndown.turndown(html.join("\n"));

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

  save(name, data, subpath = null) {
    const content = ["---"];
    content.push(YAML.stringify(data.frontmatter).trim());
    content.push("---\n");
    content.push(data.md);

    let outputPath = this.outputPath;
    if (subpath) {
      outputPath = path.join(outputPath, subpath);
    }

    Promise.resolve(fs.mkdir(outputPath, { recursive: true })).then(() =>
      fs.writeFile(
        `${outputPath}/${name}.md`,
        content.join("\n").replaceAll("/static/media", "")
      )
    );
  }

  getFaqData(scraper, $) {
    const faqs = [];

    let data = { frontmatter: {}, html: null };
    let slug = null;
    let tags = [];
    let html = [];

    const elements = $(".page-content").children(
      ":not(.default-banner):not(a#content):not(.intro)"
    );
    elements.each((idx, el) => {
      const text = $(el).text();

      switch (el.name) {
        case "h2":
          slug = slugify(text, { lower: true });
          faqs.push({
            frontmatter: { title: text, tags: ["faqs"], slug: slug },
            path: slug,
            name: "index",
            html: "",
          });

          if (idx > 1) {
            data.md = scraper.turndown.turndown(html.join("\n"));
            faqs.push(data);
          }

          data = { frontmatter: {}, html: null };
          tags = ["faq", slug];
          html = [];

          break;
        case "h3":
          if (idx > 2) {
            data.md = scraper.turndown.turndown(html.join("\n"));
            faqs.push(data);
          }

          data = { frontmatter: {}, html: null };
          html = [];
          data.frontmatter.title = text;
          data.frontmatter.tags = tags;
          data.path = slug;
          data.name = slugify(text, { lower: true });

          break;
        default:
          html.push($(el));
          break;
      }

      data.md = scraper.turndown.turndown(html.join("\n"));
      faqs.push(data);
    });

    return faqs;
  }
}

module.exports = Scraper;
