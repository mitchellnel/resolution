# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## First Time Setup

To install all of the necessary Node Modules, run:

```bash
npm install
```

Then, to test that everything is working, run:

```
npm start
```

And proceed to [http://localhost:3000](http://localhost:3000)

(If it doesn't work the first time, try again)

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

### Before Running Client Locally

You need to declare a `.env` file that contains 3 pieces of information relevant to using the Google Calendar API. This will involve following the guide linked [here](https://docs.simplecalendar.io/google-api-key/).

As a result of following the guide, and setting up the relevant Google Developer project, you should have 3 strings:
- A Google API Key
- A Google Client ID
- A Google Client Secret

Create a `.env` file within `client`, and add the following lines to it:
```
REACT_APP_GOOGLE_API_KEY="<your_google_api_key>"
REACT_APP_GOOGLE_CLIENT_ID="<your_google_client_id>"
REACT_APP_GOOGLE_CLIENT_SECRET="<your_google_client_secret>"
```

Then save this file.

### Frontend Documentation

Frontend documentation was created using TypeDoc and can be found in the "docs" folder in "client". The main HTML file for the docs is located at "docs/modules.html"
