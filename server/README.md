# Quick Links

- [Getting Started with `server`](https://github.com/mitchellnel/resolution/tree/main/server#getting-started-with-server)
- [API Documentation](https://github.com/mitchellnel/resolution/tree/main/server#api-documentation)

# Getting Started with `server`

## First Time Setup

To install all of the necessary Node Modules, run:

```bash
npm install
```

Then, to test that everything is working, run:

```
npm start
```

And proceed to [http://localhost:3333](http://localhost:3333)

## Available Scripts

In the project directory, you can run:

### `npm start`

Builds _and_ runs the server.\
Open [http://localhost:3333](http://localhost:3333) to view it in your browser.

This command will not cause the server to run if there are build errors. Some of these build errors may be unused variables. You can comment `// @ts-ignore` on the line before the error-causing line to ignore the error.

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

# API Documentation

Every resolution in the database is uniquely keyed by its case-sensitive title. This means that no two resolutions belonging to the same user can have the same title.

## Endpoints

### `/api/create-resolution`

Creates a resolution and adds it to the database under the path `resolutions/user_id`.

This API must be called by making a **POST** request on this endpoint to the server (using HTTP). The body of the request will contain the arguments in JSON format.

Arguments:

- `user_id` (string)
- `title` (string)
- `description` (string)

Returns: a Boolean indicating creation success.

### `/api/read-resolution?user_id=<user_id>`

Reads all of the resolutions that belong to a user -- these are located in the database under the path `resolutions/user_id`

This API must be called by making a **GET** request on this endpoint to the server (using HTTP). The arguments for the request will be sent as query parameters.

Arguments:

- `user_id` (string)

Returns: a JSON object containing a list of Resolution objects -- objects that have a title and description field representing the fields of a resolution.

### `/api/update-resolution`

Updates a specific resolution that belongs to the user -- these are located in the database under the path `resolutions/user_id`

This API must be called by making a **POST** request on this endpoint to the server (using HTTP). The body of the request will contain the arguments in JSON format.

Arguments:

- `user_id` (string)
- `current_title` (string)
- `new_title` (string)
- `new_description` (string)

Returns: a Boolean indicating update success.

### `/api/delete-resolution`

Deletes a specific resolution that belongs to the user -- these are located in the database under the path `resolutions/user_id`

This API must be called by making a **POST** request on this endpoint to the server (using HTTP). The body of the request will contain the arguments in JSON format.

Arguments:

- `user_id` (string)
- `title_to_delete` (string)

Returns: a Boolean indicating delete success.

## TypeScript Interfaces

(TODO) To make utilising the APIs easier, various TypeScript interfaces can be found in the [server-side](https://github.com/mitchellnel/resolution/tree/main/server/constants/apiInterfaces.ts) and [client-side](https://github.com/mitchellnel/resolution/tree/main/client/constants/apiInterfaces.ts) directories.
