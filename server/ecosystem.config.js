module.exports = {
  apps: [
    {
      name: "project-management-app",
      script: "npm",
      args: "ren dev",
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
