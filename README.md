# Bad Debt Dashboard

## Adding a lending platform
to add a lending platform

you will need to add a parser [here](https://github.com/Risk-DAO/bad-debt-leaderboard/tree/main/backgroundJobs)
and submit a pull request

after the parser is deployed and the API returns the data 

you will need to add the icon of your lending platfrom in WEBP format to 
public/images/platforms/

## Lending Platforms Explainers
to add information about your lending platform
explaining about debt and risk releated things
please do

folow these steps
- create a new component at lending-platform-details directory
- use a simple function component rendering simple HTML markup you can follow an example
- register your component in the index.js file at that same directory
- run the project to see it render in the Dashboard
  
for any questios feel free to reach out at our [discord channel](https://discord.com/invite/NYyeDQDDvM)

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
