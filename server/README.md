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

Every resolution in the database is uniquely keyed by the Firebase Realtime Database service. This key is generated when the resolution is pushed to the database.

These keys are received by the client when reading resolutions, and must be passed to the `/api/update-resolution` or `/api/delete-resolution` endpoints in order to utilise their functionality.

## Endpoints

### `/api/create-resolution`

Creates a resolution and adds it to the database under the path `resolutions/user_id`.

This API must be called by making a **POST** request on this endpoint to the server (using HTTP). The body of the request will contain the arguments in JSON format.

Arguments:

- `user_id` (string)
- `title` (string)
- `description` (string)

Returns: a Boolean indicating creation success.

The argument object is interfaced as `APICreateResolutionArguments`, and the return object is interfaces as `APICreateResolutionReturn`.

If the body of the request has _extra_ fields than those defined above, an error **will not** be thrown. If the body of the request lacks any of the fields defined above, an error **will** be thrown.

### `/api/read-resolution?user_id=<user_id>`

Reads all of the resolutions that belong to a user -- these are located in the database under the path `resolutions/user_id`

This API must be called by making a **GET** request on this endpoint to the server (using HTTP). The arguments for the request will be sent as query parameters.

Arguments:

- `user_id` (string)

Returns: a JSON object containing what is essentially a map of RTDB keys to Resolution objects -- objects that have a title and description field representing the fields of a resolution.

If the the request has _extra_ query parameters than those defined above, an error **will not** be thrown. If the request lacks any of the query parameters defined above, an error **will** be thrown.

### `/api/update-resolution`

Updates a specific resolution that belongs to the user -- these are located in the database under the path `resolutions/user_id/firebase_key`

This API must be called by making a **POST** request on this endpoint to the server (using HTTP). The body of the request will contain the arguments in JSON format.

Arguments:

- `user_id` (string)
- `firebase_key` (string)
- `new_title` (string)
- `new_description` (string)

Returns: a Boolean indicating update success.

The argument object is interfaced as `APIUpdateResolutionArguments`, and the return object is interfaces as `APIUpdateResolutionReturn`.

If the body of the request has _extra_ fields than those defined above, an error **will not** be thrown. If the body of the request lacks any of the fields defined above, an error **will** be thrown.

A `new_title` and a `new_description` must **both** be passed to make the update. This should be somewhat trivial to implement on the front-end using the received resolution data.

### `/api/delete-resolution`

Deletes a specific resolution that belongs to the user -- these are located in the database under the path `resolutions/user_id`

This API must be called by making a **POST** request on this endpoint to the server (using HTTP). The body of the request will contain the arguments in JSON format.

Arguments:

- `user_id` (string)
- `firebase_key` (string)

Returns: a Boolean indicating delete success.

The argument object is interfaced as `APIDeleteResolutionArguments`, and the return object is interfaces as `APIDeleteResolutionReturn`.

If the body of the request has _extra_ fields than those defined above, an error **will not** be thrown. If the body of the request lacks any of the fields defined above, an error **will** be thrown.

## TypeScript Interfaces

To make utilising the APIs easier, various TypeScript interfaces can be found in the respectice [server-side](https://github.com/mitchellnel/resolution/tree/main/server/constants) and [client-side](https://github.com/mitchellnel/resolution/tree/main/client/src/constants) constant directories.
