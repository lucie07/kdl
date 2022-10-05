module.exports = {
  navKey: (data) => {
    return data.eleventyNavigation?.key || data.navKey;
  },
};
