# Password Generator v2

A passphrase / password generator running in the web browser using the [EFF word lists](https://www.eff.org/deeplinks/2016/07/new-wordlists-random-passphrases).

It's the second iteration of my [password generator](https://github.com/andygock/password-generator) web app using React. The original version was plain vanilla.

[![Netlify Status](https://api.netlify.com/api/v1/badges/7eecd76e-39df-47db-84a1-26abaa5c93dd/deploy-status)](https://app.netlify.com/sites/p4ss/deploys)

- [Live demo hosted by Netlify](https://p4ss.netlify.app)

Update: Option to generate Base64 passphrases as well, selection menu found under footer.

## Development process

Install dependencies

    yarn

Development build and serve:

    yarn start

Production build (files saved in `dist/`):

    yarn build

## Use of hash routing

This makes it bookmark-friendly with recallable user-selected parameters. The hash formats supported are:

    #/:words
    #/:words/:passphrases
    #/:words/:passphrases/:wordlist
    #/:words/:passphrases/:wordlist/stupid

e.g

    http://localhost:1234/#/4/10/eff-short1

If no hash is present, default parameters are used.

## Stupid mode

The "stupid mode" is option to generate a less secure password with a mix of upper case, lower case, numbers ahd special characters.

    UnawakeFrosty1344#

This might be useful for those web sites that have minimum password requirements which forces users to create passwords that are hard for humans to remember, but easy for computers to guess.

## Credits

- Fork me on GitHub ribbon by [Simon Whitaker](https://github.com/simonwhitaker/github-fork-ribbon-css)
