# Password Generator v2

Second iteration of my [password generator](https://github.com/andygock/password-generator) web app using React. The original version was plain vanilla.

## TODO

### Use of `window.location.hash`

This makes it bookmark-friendly with user-selected parameters recallable. The formats supported are:

    #/:words
    #/:words/:passphrases
    #/:words/:passphrases/:wordlist

e.g

    http://localhost:1234/#/4/10/eff-short1

If no hash is present, default parameters are used.
