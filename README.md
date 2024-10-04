# Password Generator v2

A passphrase / password generator running in the web browser using the [EFF word lists](https://www.eff.org/deeplinks/2016/07/new-wordlists-random-passphrases).

It's the second iteration of my [password generator](https://github.com/andygock/password-generator) web app using React. The original version was plain vanilla.

- [Live demo hosted by GitHub Pages](https://pass.gock.net/)

Update: Option to generate Base64 passphrases as well, selection menu found under footer.

## Development process

I used [pnpm](https://pnpm.io/) so I'll describe this workflow here, but you could use your own favourite package manager instead e.g npm, yarn etc.

    npm install -g pnpm

Install dependencies

    pnpm install

Start development server

    pnpm start

Build for production into `dist/`

    pnpm build

If required, use the following Netlify build command

    pnpm build || ( npm install pnpm && pnpm build )

## Use of hash routing

This makes it bookmark-friendly with recallable user-selected parameters. The hash formats supported are:

    #/:words
    #/:words/:passphrases
    #/:words/:passphrases/:wordlist
    #/preset1/:words/:passphrases/:wordlist

e.g

    http://localhost:1234/#/4/10/eff-short1

If no hash is present, default parameters are used.

## Credits

- [EFF Dice-Generated Passphrases](https://www.eff.org/dice)
- [Orchard Street Wordlists](https://github.com/sts10/orchard-street-wordlists) by Sam Schlinkert
