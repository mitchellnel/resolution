# Getting Started with `server`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the server.\
Open [http://localhost:3333](http://localhost:3333) to view it in your browser.

The page **will not** reload when you make changes.

The server **will not** update to reflect any saved changes in the source code that occur while running. See `npm run dev` to achieve this functionality.

### `npm run build`

Builds the app for production to the `dist` folder.

It correctly compiles all of the TypeScript down to JavaScript, also minifying the build.

### `npm run dev`

Runs the server in a "development setting".\
Open [http://localhost:3333](http://localhost:3333) to view it in your browser.

The page **will not** reload when you make changes.

However, the server **will** update to reflect any saved changes in the source code that occur while running. This means that if you make changes, and save them, the TypeScript will automatically be compiled, and the server restarted.

This is achieved by using the `concurrently` package. We concurrently run `npx tsc --watch` to continually watch for changes in the source `.ts` files, recompiling the files whenever changes occur, and `nodemon` to restart the server whenever file changes occur.

## Basic Express Guide

From the Express docs:

> Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

> With a myriad of HTTP utility methods and middleware at your disposal, creating a robust API [with Express] is quick and easy.

Both justify our usage of Express on the backend.

We set up Express with the following code:

```typescript
import express, { Express, Request, Response } from "express";
// express is essentially a constructor we use to initialise our server application
// the latter 3 are types

// create an Express application -- we use this object for everything
const app: Express = express();

// create a basic endpoint for GET on the root "/"
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});
// req is the HTTP Request, res is the HTTP Response we are sending back

// start the server using app.listen(portNumber)
app.listen(3333);
```

## dotenv Guide

From the dotenv docs:

> Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env

.env files are simple text configuration files that carry information that may be necessary for controlling your applications. They may also contain sensitive data that we don't want uploaded to GitHub (or other file hosting services), such as API keys.

For usage instructions, see the docs [here](https://www.npmjs.com/package/dotenv#Usage).
