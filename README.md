# Password Generator v2

A passphrase / password generator running in the web browser using the [EFF word lists](https://www.eff.org/deeplinks/2016/07/new-wordlists-random-passphrases).

It's the second iteration of my [password generator](https://github.com/andygock/password-generator) web app using React. The original version was plain vanilla.

[![Netlify Status](https://api.netlify.com/api/v1/badges/7eecd76e-39df-47db-84a1-26abaa5c93dd/deploy-status)](https://app.netlify.com/sites/p4ss/deploys)

- [Live demo hosted by Netlify](https://p4ss.netlify.app)

## Development process

Install dependencies

    yarn

Development build and serve:

    yarn start

Production build (files saved in `build/`):

    yarn build

To serve `build/`. Requires global install of [http-server](https://www.npmjs.com/package/http-server).

    yarn serve

## TODO

### Use of `window.location.hash`

This makes it bookmark-friendly with user-selected parameters recallable. The formats supported are:

    #/:words
    #/:words/:passphrases
    #/:words/:passphrases/:wordlist

e.g

    http://localhost:1234/#/4/10/eff-short1

If no hash is present, default parameters are used.
