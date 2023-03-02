// const { createCanvas } = require("canvas");
const helpers = require("./_helpers");
// const fs = require("fs/promises");

// function generateProjectImage(text, path) {
//   const width = parseInt(process.env.PROJECT_PLACEHOLDERS_WIDTH || 1024);
//   const height = parseInt(process.env.PROJECT_PLACEHOLDERS_HEIGHT || 576);

//   const fillColours = process.env.PROJECT_PLACEHOLDERS_FILL_COLOURS?.split(
//     " "
//   ) || ["#d16014"];
//   const font = process.env.PROJECT_PLACEHOLDERS_FONT || "Sans-serif";
//   const fontSize =
//     height /
//     parseInt(process.env.PROJECT_PLACEHOLDERS_FONT_RATIO_HEIGHT || 100);
//   const textColour = "#ffffff";

//   const canvas = createCanvas(width, height, "svg");
//   const context = canvas.getContext("2d");

//   context.fillStyle =
//     fillColours[Math.floor(Math.random() * fillColours.length)];
//   context.fillRect(0, 0, width, height);
//   context.fillStyle = textColour;
//   context.font = `bold ${fontSize}px ${font}`;

//   const textSize = context.measureText(text);
//   context.fillText(
//     text,
//     canvas.width / 2 - textSize.width / 2,
//     canvas.height / 2 + fontSize / 2
//   );

//   const buffer = canvas.toBuffer("image/svg+xml");
//   fs.writeFile(path, buffer);
// }

module.exports = async ({ directus }) => {
  return helpers
    .loadData(directus, "project", "projects", ["*.*.*.*"])
    .then((data) =>
      data.map((item) => {
        if (item.image === null) {
          item.image = {};
          item.image.path = `/assets/images/projects/${item.slug}.svg`;
          // const imagePath = `./public${item.image.path}`;

          const imageText = item.alternateName || item.name.split(":")[0];
          item.image.description = `Placeholder image with the text ${imageText}`;

          // fs.access(imagePath)
          //   .then(
          //     () =>
          //       process.env.PROJECT_PLACEHOLDERS_FORCE &&
          //       generateProjectImage(imageText, imagePath)
          //   )
          //   .catch(() => generateProjectImage(imageText, imagePath));
        }

        return item;
      })
    );
};
