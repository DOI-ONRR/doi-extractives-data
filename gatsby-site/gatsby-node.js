exports.modifyBabelrc = ({ babelrc }) => {
  if (process.env.NODE_ENV !== `production`) {
    return {
      plugins: [
      ].concat(babelrc.plugins),
    };
  }
  return {
    plugins: [].concat(babelrc.plugins),
  };
};
