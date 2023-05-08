# ReactJS - React Demo Apps

## Prerequisites

- You need to install [Node.js](https://nodejs.org/en) for local development.

## How to setup local env

- Add `local.kyro.co` into local host file.
- Add `env-cmd` and `react-scripts` globally `npm install -g env-cmd react-scripts`.
- Install dependencies `npm install`.
- To run dev server, Run `npm start`.
- You can access `https://local.kyro.co:3000` with your browser. If you see ssl error on your browser, please do connect with dangerous site(this is local development).

## How to generate your keys and set up values in codes

- Go to [KWS Console](https://console.kws.kyro.co).
- Sign Up for new user, login if already registered.
- Go to [API Keys](https://console.kws.kyro.co/apikeys) from the Sidebar to generate New Key or retrieve existing Key.
- Create a new key with suitable name.

- Paste the value from Key column from the generated key into REACT_APP_AUTH_KEY in your .env file.
- Paste the value from Secret column from the generated key into REACT_APP_AUTH_SECRET in your .env file.
- Restart your local server after replacing keys for changes to take place.

## How to retrieve your Kyro Application ID and set up the value in codes

- Go to [KWS Console](https://console.kws.kyro.co).
- Sign Up for new user, login if already registered.
- Go to [Websites](https://builder.kyro.co/build/websites) under Build from the Sidebar.
- Click on your website to see the detail view.
- Copy the _Website ID_ from the bottom of the screen.

- Paste the value from Website ID into REACT_APP_KYRO_APP_ID in your .env file. Restart your local server after replacing keys for changes to take place.

## How to build

- Run `npm run build` for development build.
