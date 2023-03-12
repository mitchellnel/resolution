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

## Resolution CRUD

Every resolution in the database is uniquely keyed by the Firebase Realtime Database service. This key is generated when the resolution is pushed to the database.

These keys are received by the client when reading resolutions, and must be passed to the `/api/update-resolution` or `/api/delete-resolution` endpoints in order to utilise their functionality.

### `/api/create-resolution`

Creates a resolution and adds it to the database under the path `resolutions/user_id`.

This API must be called by making a **POST** request on this endpoint to the server (using HTTP). The body of the request will contain the arguments in JSON format.

Arguments:

- `user_id` (string)
- `title` (string)
- `description` (string)

Returns: a JSON object with a Boolean field indicating creation success. If the create operation failed, then a `reason` field will be defined with an error message. If the read succeeded, then this field will not exist.

The argument object is interfaced as `APICreateResolutionArguments`, and the return object is interfaces as `APICreateResolutionReturn`.

If the body of the request has _extra_ fields than those defined above, an error **will not** be thrown. If the body of the request lacks any of the fields defined above, an error **will** be thrown.

A sample Goal for the newly created Resolution will be created when this endpoint is called.

### `/api/read-resolution?user_id=<user_id>`

Reads all of the resolutions that belong to a user -- these are located in the database under the path `resolutions/user_id`

This API must be called by making a **GET** request on this endpoint to the server (using HTTP). The arguments for the request will be sent as query parameters.

Arguments:

- `user_id` (string)

Returns: a JSON object with a Boolean field indicating read success. If the read failed, then a `reason` field will be defined with an error message. If the read succeeded, then a `resolutions` field will be populated with what is essentially map of Firebase RTDB keys to resolution objects -- objects that have a title and description field representing the fields of a resolution.

If the the request has _extra_ query parameters than those defined above, an error **will not** be thrown. If the request lacks any of the query parameters defined above, an error **will** be thrown.

Note that since Goals are part of a single Resolution object, calling this endpoint will also return the list of Goals associated with each Resolution.

### `/api/update-resolution`

Updates a specific resolution that belongs to the user -- these are located in the database under the path `resolutions/user_id/firebase_key`

This API must be called by making a **POST** request on this endpoint to the server (using HTTP). The body of the request will contain the arguments in JSON format.

Arguments:

- `user_id` (string)
- `firebase_key` (string)
- `new_title` (string)
- `new_description` (string)

Returns: a JSON object with a Boolean field indicating creation success. If the create operation failed, then a `reason` field will be defined with an error message. If the read succeeded, then this field will not exist.

The argument object is interfaced as `APIUpdateResolutionArguments`, and the return object is interfaces as `APIUpdateResolutionReturn`.

If the body of the request has _extra_ fields than those defined above, an error **will not** be thrown. If the body of the request lacks any of the fields defined above, an error **will** be thrown.

A `new_title` and a `new_description` must **both** be passed to make the update. This should be somewhat trivial to implement on the front-end using the received resolution data.

### `/api/delete-resolution`

Deletes a specific resolution that belongs to the user -- these are located in the database under the path `resolutions/user_id`

This API must be called by making a **POST** request on this endpoint to the server (using HTTP). The body of the request will contain the arguments in JSON format.

Arguments:

- `user_id` (string)
- `firebase_key` (string)

Returns: a JSON object with a Boolean field indicating creation success. If the create operation failed, then a `reason` field will be defined with an error message. If the read succeeded, then this field will not exist.

The argument object is interfaced as `APIDeleteResolutionArguments`, and the return object is interfaces as `APIDeleteResolutionReturn`.

If the body of the request has _extra_ fields than those defined above, an error **will not** be thrown. If the body of the request lacks any of the fields defined above, an error **will** be thrown.

## Goal CRUD

Every Goal in the database is uniquely keyed by the Firebase Realtime Database service. This key is generated when the Goal is pushed to the database.

These keys are received by the client when reading Goals, and must be passed to the `/api/complete-goal`, `/api/update-goal-description`, and `/api/delete-goal` endpoints in order to utilise their functionality.

The Goals are located under the path `resolutions/user_id/resolution_key/goals/`.

### `/api/create-goal`

Creates a Goal and adds it to the database under the path `resolutions/user_id/resolution_key/goals`.

This API must be called by making a **POST** request on this endpoint to the server (using HTTP). The body of the request will contain the arguments in JSON format.

Arguments:

- `user_id` (string)
- `resolution_key` (string)
- `description` (string)
- `nTimesToAchieve` (integer)

Returns: a JSON object with a Boolean field indicating creation success. If the create operation failed, then a `reason` field will be defined with an error message. If the read succeeded, then this field will not exist.

The argument object is interfaced as `APICreateGoalArguments`, and the return object is interfaces as `APICreateGoalReturn`.

If the body of the request has _extra_ fields than those defined above, an error **will not** be thrown. If the body of the request lacks any of the fields defined above, an error **will** be thrown.

The `description` field is required to create a Goal. It cannot be an empty string.

### `/api/read-goal?user_id=<user_id>&resolution_key=<resolution_key>`

Reads all of the Goals that belong to a user's Resolution -- these are located in the database under the path `resolutions/user_id/resolution_key/goals`

This API must be called by making a **GET** request on this endpoint to the server (using HTTP). The arguments for the request will be sent as query parameters.

Arguments:

- `user_id` (string)
- `resolution_key` (string)

Returns: a JSON object with a Boolean field indicating read success. If the read failed, then a `reason` field will be defined with an error message. If the read succeeded, then a `goals` field will be populated with what is essentially map of Firebase RTDB keys to Goal objects -- objects that have a description and complete field that represent the Goal's description and whether it has been completed, respectively.

If the the request has _extra_ query parameters than those defined above, an error **will not** be thrown. If the request lacks any of the query parameters defined above, an error **will** be thrown.

### `/api/achieve-goal`

Decrements the `nTimesToAchieve` field on a specific Goal that belongs to a user's Resolution -- this field is located in the database under the path `resolutions/user_id/resolution_key/goals/goal_key/nTimesToAchieve`

This endpoint is only designed to reduce `nTimesToAchieve` by 1. If the `nTimesToAchieve` field is already 1, then the endpoint will return an error.

This API must be called by making a **POST** request on this endpoint to the server (using HTTP). The body of the request will contain the arguments in JSON format.

Arguments:

- `user_id` (string)
- `resolution_key` (string)
- `goal_key` (string)

Returns: a JSON object with a Boolean field indicating creation success. If the create operation failed, then a `reason` field will be defined with an error message. If the read succeeded, then this field will not exist.

The argument object is interfaced as `APIAchieveGoalArguments`, and the return object is interfaces as `APIAchieveGoalReturn`.

If the body of the request has _extra_ fields than those defined above, an error **will not** be thrown. If the body of the request lacks any of the fields defined above, an error **will** be thrown.

### `/api/complete-goal`

Updates the complete field on a specific Goal that belongs to a user's Resolution -- this field is located in the database under the path `resolutions/user_id/resolution_key/goals/goal_key/completed`

This endpoint will only work when the `nTimesToAchieve` field is 1. If the `nTimesToAchieve` field is not 1, then the endpoint will return an error.

This API must be called by making a **POST** request on this endpoint to the server (using HTTP). The body of the request will contain the arguments in JSON format.

Arguments:

- `user_id` (string)
- `resolution_key` (string)
- `goal_key` (string)
- `completed` (Boolean)

Returns: a JSON object with a Boolean field indicating creation success. If the create operation failed, then a `reason` field will be defined with an error message. If the read succeeded, then this field will not exist.

The argument object is interfaced as `APICompleteGoalArguments`, and the return object is interfaces as `APICompleteGoalReturn`.

If the body of the request has _extra_ fields than those defined above, an error **will not** be thrown. If the body of the request lacks any of the fields defined above, an error **will** be thrown.

The `completed` field must be passed to make the update. It can either be `true` or `false`. The API **will not** automatically flip the Boolean -- the desired completion state must be passed via the arguments.

### `/api/update-goal-description`

Updates the description field on a specific Goal that belongs to a user's Resolution -- this field is located in the database under the path `resolutions/user_id/resolution_key/goals/goal_key/description`

This API must be called by making a **POST** request on this endpoint to the server (using HTTP). The body of the request will contain the arguments in JSON format.

Arguments:

- `user_id` (string)
- `resolution_key` (string)
- `goal_key` (string)
- `new_description` (Boolean)

Returns: a JSON object with a Boolean field indicating creation success. If the create operation failed, then a `reason` field will be defined with an error message. If the read succeeded, then this field will not exist.

The argument object is interfaced as `APIUpdateGoalDescriptionArguments`, and the return object is interfaces as `APIUpdateGoalDescriptionReturn`.

If the body of the request has _extra_ fields than those defined above, an error **will not** be thrown. If the body of the request lacks any of the fields defined above, an error **will** be thrown.

The `new_description` field must be passed to make the update. It cannot be an empty string.

### `/api/delete-goal`

Deletes a specific Goal that belongs a user's Resolution -- these are located in the database under the path `resolutions/user_id/resolution_key/goals`

This API must be called by making a **POST** request on this endpoint to the server (using HTTP). The body of the request will contain the arguments in JSON format.

Arguments:

- `user_id` (string)
- `resolution_key` (string)
- `goal_key` (string)

Returns: a JSON object with a Boolean field indicating creation success. If the create operation failed, then a `reason` field will be defined with an error message. If the read succeeded, then this field will not exist.

The argument object is interfaced as `APIDeleteGoalArguments`, and the return object is interfaces as `APIDeleteGoalReturn`.

If the body of the request has _extra_ fields than those defined above, an error **will not** be thrown. If the body of the request lacks any of the fields defined above, an error **will** be thrown.

## TypeScript Interfaces

To make utilising the APIs easier, various TypeScript interfaces can be found in the respectice [server-side](https://github.com/mitchellnel/resolution/tree/main/server/constants) and [client-side](https://github.com/mitchellnel/resolution/tree/main/client/src/constants) constant directories.
