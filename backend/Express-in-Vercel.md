# Using Express.js with Vercel
[Express.js](https://expressjs.com/) is a popular server framework used with Node.js. In this guide, we will cover how to deploy an Express.js application to Vercel along with some additional topics you’ll need to consider when adapting to a serverless environment.

Deploying an Express.js application on Vercel should require minimal or no code changes. Let’s use the steps below to create a new Express.js project and deploy it to Vercel.

We have an [example of an Express project](https://github.com/vercel/examples/tree/main/solutions/express) that can be cloned and deployed to Vercel as your initial starting point.

Before you get started, you will need to have Node.js installed and a [Vercel account](https://vercel.com/signup) to complete all the steps.

In your terminal, create a new directory and initialize your project:

```

mkdir new-express-project 
cd new-express-project 
npm init -y
```


These commands create a new project directory and a `package.json` file with default settings.

Add Express to your project:

*   Create a directory named `/api`.
*   Inside `/api`, create a file named `index.ts`. This will be your main server file.

Edit your `index.ts` with the following code to set up a basic Express.js server:

```

const express = require("express");
const app = express();
app.get("/", (req, res) => res.send("Express on Vercel"));
app.listen(3000, () => console.log("Server ready on port 3000."));
module.exports = app;
```


This code will:

*   Define the base route `/`
*   Return `Express on Vercel` when it’s called
*   And start the Express.js server running on port `3000`

By using a `vercel.json` file, you can [control how Vercel configures your application](https://vercel.com/docs/projects/project-configuration).

For our application, we’re going to tell Vercel to route all incoming requests to our `/api` folder.

To configure this, create a `vercel.json` file in the root of your project and add the following code:

```

{ "version": 2, "rewrites": [{ "source": "/(.*)", "destination": "/api" }] }
```


You can replicate the Vercel deployed environment locally by using the [Vercel CLI](https://vercel.com/docs/cli). This allows you to test how your application will run as if it were running on Vercel, even before you deploy.

To get started, you need to install the Vercel CLI by running the following command in your terminal.

Next, login to Vercel to authorize the Vercel CLI to run commands on your Vercel account.

Now you use the local development command, which will also execute the `vercel.json` configuration you created above.

Running `vercel dev` will ask you some questions. You can answer however you like, but the defaults will suffice. This process will also create a new Vercel Project, but don’t worry, this will not make your Express.js app publicly accessible yet. We’ll get to that later.

When you’re done answering questions, you should now have a locally running server on `http://localhost:3000` where you can test how your application works before you deploy to Vercel.

There are several ways you can [deploy a project on Vercel](https://vercel.com/docs/deployments/overview), some of which include:

*   Vercel CLI
*   Creating a new project in the Vercel dashboard
*   Connecting your Git repo to Vercel

Since we’ve been working with the Vercel CLI, we’ll continue to use it to deploy your project on Vercel.

When you’re ready to make your Express.js application live and publicly accessible, you can run the `vercel` command to create a deployment.

This will upload your application to Vercel, build it, and deploy it. When the command is finished, it will give you a URL to your application. This will create your first deployment for your project.

From this point forward, running `vercel` again will create a [Vercel Preview Deployment](https://vercel.com/docs/deployments/preview-deployments). This will give you a different URL to your application where you can test you changes live on Vercel and share this link with others to test.

When you are ready to make the latest changes live on your production URL, you can run `vercel —dev` or `vercel promote [url]`.

If you are transitioning from a fully managed server or containerized environment to Vercel’s serverless architecture, you may need to rethink a few concepts in your application since there is no longer a server always running in the background.

*   **Websockets**: Serverless Functions have [maximum execution limits](https://vercel.com/docs/concepts/limits/overview#general-limits) and should respond as quickly as possible. They should not subscribe to data events. Instead, we need a _client_ that **subscribes** to data events and a _Serverless Function_ that **publishes** new data. Consider using a serverless friendly [Realtime](https://vercel.com/docs/solutions/realtime) data provider.
*   **Database Connections**: The nature of serverless functions means they can open multiple database connections in response to increasing traffic. To manage this efficiently, use serverless-friendly databases or implement [connection pooling](https://vercel.com/docs/solutions/databases). This helps ensure optimal connections and maintains application uptime.
*   **Templating and View Engines**: In serverless environments, optimizing response computation is crucial. Consider the efficiency of view engines like [React](https://react.dev/), [Pug](https://pugjs.org/api/express.html) or [EJS](https://ejs.co/). It is also important to set up [correct headers](https://vercel.com/docs/concepts/edge-network/caching) to enable caching, preventing the need to compute the same response for every request. This approach minimizes on-demand computation and leverages cached content for future requests.
*   **Error Handling**: Express.js will swallow errors that can put the main function into an undefined state unless properly handled. Express.js will render it’s own error pages (500), which prevents Vercel from discarding the function and resetting its state. Implement robust error handling to ensure errors are properly managed and do not interfere with the serverless function's lifecycle.

Congratulations on getting your Express.js application deployed to Vercel!

For developers using Vercel, you may consider:

*   Transitioning from a traditional Express.js server to build-in [Vercel Functions](https://vercel.com/docs/functions). Taking this step means you can stop configuring your own server from scratch and let Vercel manage that for you.
*   Transitioning to [Next.js](https://nextjs.org/) if you are migrating from an Express.js Server and React SPA. Taking this step would reduce the overhead and maintenance of managing two separate projects and repositories and merging them into one for increased productivity, code reuse, and more. Next.js also brings key advantages such as faster page loads, automatic scaling, and simplified deployment processes.

It’s recommend that you incrementally transition to these to manage risks effectively while enhancing your product and platform. For additional guidance, check out our [**community post on Express 101**](https://community.vercel.com/t/express-101-everything-about-deploying-your-express-app-on-vercel/4870), where you'll find tips, troubleshooting advice, and real-world examples from fellow developers.

In the mean time, your successfully deployed Express.js application on Vercel can continue to serve you and your users.

