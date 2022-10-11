module.exports = {
  // SEO plugin
  author: (data) => data.authors?.join(", "),
  image: (data) => data.feature?.image,
  // SEO plugin end
  navKey: (data) => data.eleventyNavigation?.key || data.navKey,
};
