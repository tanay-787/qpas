# Express 101: Everything about deploying your Express app on Vercel - Discussions - Vercel Community
[](#p-16696-getting-started-1)Getting started
---------------------------------------------

* * *

Express.js is one of the most popular framework choices for building a backend using Node.js. If you are starting a new Express project and want to deploy it to Vercel, we recommend you to follow the [Using Express.js with Vercel](https://vercel.com/guides/using-express-with-vercel) guide.

[](#p-16696-common-patterns-2)Common patterns
---------------------------------------------

* * *

If you are coming from an existing project, we’ve put together [this example repository](https://github.com/vercel-support/express-vercel) to showcase the common development patterns for Express apps.

> ![:information_source:](https://emoji.discourse-cdn.com/apple/information_source.png?v=12 ":information_source:") We recommend hosting your frontend application on a separate Vercel project to ensure that your frontend benefits from Vercel’s optimized CDN, reduced cost, and minimized complexity. However, if you wish to host it via Express, you can do it with minimal changes in your code.

### [](#p-16696-express-with-vite-react-3)Express with Vite (React)

The best way to use Express with your Vite project is to create a `api/index.js` file in your Vite project and add the server code to it. After this, you only need to ensure that your Vercel project is using the Vite preset.

[![Vite project configuration in Vercel dashboard](https://global.discourse-cdn.com/vercel/optimized/2X/9/9bcef14ca30b6708b8653d6c035afe9a69f1f79c_2_690x319.png)](https://global.discourse-cdn.com/vercel/original/2X/9/9bcef14ca30b6708b8653d6c035afe9a69f1f79c.png "Vite project configuration in Vercel dashboard")

After a successful deployment, you can also confirm from the deployment details page that the Vite app is served as static assets and the Express app as a serverless function:

[![Successful deployment build outputs](https://global.discourse-cdn.com/vercel/optimized/2X/8/8e4d7a4f10ad41e4354d5cf2877503fb3a1c81c0_2_690x362.jpeg)](https://global.discourse-cdn.com/vercel/original/2X/8/8e4d7a4f10ad41e4354d5cf2877503fb3a1c81c0.jpeg "Successful deployment build outputs")

### [](#p-16696-express-with-static-content-4)Express with static content

You may want to serve some static content behind a route handler in the Express application. To do so, you can create a route handler and return the HTML response as you would do in any Express application, as follows:

```
// send the about.html file
app.get("/about", function (req, res) {
	// run custom logic to authenticate request or log data
  res.sendFile(path.join(__dirname, "..", "static", "about.html"));
});

```


> However, you must note that serving static content through Express is an anti-pattern because it doesn’t utilizes the Vercel CDN and also adds to the cost of Vercel serverless function invocation for each request.

### [](#p-16696-cors-with-express-5)CORS with Express

To enable CORS on your Express application, you can use the [cors](https://expressjs.com/en/resources/middleware/cors.html) middleware, as follows:

```
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://YOUR_FRONTEND_DOMAIN"],
  })
);

```


[](#p-16696-troubleshooting-common-issues-6)Troubleshooting common issues
-------------------------------------------------------------------------

* * *

This guide is to help you troubleshoot common issues when migrating your Express project to a serverless platform.

### [](#p-16696-running-the-node-app-7)Running the Node app

If you are coming from a server platform, you may have your `start` script setup to `node index.js` or something similar. However, this will not work on Vercel because it’s a serverless platform. Therefore, your application needs to be encapsulated in a serverless function that gets executed on request. We recommend following the [Using Express.js with Vercel](https://vercel.com/guides/using-express-with-vercel) guide to get started.

### [](#p-16696-using-incorrect-project-structure-8)Using incorrect project structure

In your project, you may have the main server file located at the root of the project or nested somewhere else. But, when using Express with Vercel, you must expose the main server from the `/api` folder. This way Vercel knows where to look for the serverless functions and deploy it correctly.

### [](#p-16696-missing-rewrites-configuration-9)Missing rewrites configuration

By default, your Express application will be served from the `/api/YOUR_SERVER_FILE_NAME` endpoint. To ensure that all requests on your deployment reach your Express server, you must add the `rewrites` configuration to your project’s `vercel.json`, as follows:

```
  "rewrites": [{ "source": "/(.*)", "destination": "/api" }],

```


### [](#p-16696-missing-files-10)Missing files

If you are getting missing files or file not found errors in your deployed application, you can use the `includeFiles` option in the `functions` configuration. This ensures the Vercel includes these files in the deployment output and your code can access them.

For example, if your app has some predefined HTML templates that you want to use, you can keep the `templates` folder at the project root and then update the `vercel.json` file with the `functions > includeFiles` configuration.

```
  "functions": {
    "api/index.js": {
      "includeFiles": "templates/**/*"
    }
  }

```


### [](#p-16696-using-legacy-verceljson-configuration-11)Using legacy `vercel.json` configuration

You may be using [legacy](https://vercel.com/docs/projects/project-configuration#legacy) configuration options such as `routes` and `builds` in your `vercel.json` file. While these options may not cause issues directly, it’s better to use the updated options to make use of the latest features and avoid issues. To get started, follow the [Upgrading legacy route](https://vercel.com/docs/projects/project-configuration#upgrading-legacy-routes) guide.

[](#p-16696-resources-12)Resources
----------------------------------

* * *

*   [Using Express.js with Vercel](https://vercel.com/guides/using-express-with-vercel)
*   [GitHub - vercel-support/express-vercel](https://github.com/vercel-support/express-vercel)
*   [Debugging 404 Errors](https://community.vercel.com/t/debugging-404-errors/437)