export default {
  allowCypressEnv: false,

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },

  e2e: {
    e2e: {
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}',
  },
  },
};
