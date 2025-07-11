module.exports = {
  publicPath: "/",
  chainWebpack: config => {
    config.module
      .rule('tsv')
      .test(/\.tsv$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end();
  }
};
