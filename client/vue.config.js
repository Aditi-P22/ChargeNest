module.exports = {
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].googleMapsApiKey = process.env.MAP_API_KEY;
      return args;
    });
  },
};
