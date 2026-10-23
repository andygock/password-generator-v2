# Password Generator v2

A passphrase / password generator running in the web browser using the EFF, Orchard Street and 1Password Agile word lists.

It's the second iteration of my [password generator](https://github.com/andygock/password-generator) web app using React. The original version was plain vanilla.

- [Live demo hosted on Vercel](https://pass.gock.net/)

The String mode supports hexadecimal, Base62, Web Safe, Human Friendly and Base64 passwords, with equivalent generation commands for several shells and languages.

## Development process

Use Node.js 22.13 or later within the 22.x series, or Node.js 24 or later, and pnpm 12.3.4 (pinned in `package.json`). Install pnpm using its official installation instructions, then run:

    pnpm install
    pnpm dev

Build for production into `dist/` and preview locally:

    pnpm build
    pnpm preview

Run lint and focused unit/component tests:

    pnpm lint
    pnpm test
    pnpm format:check

Use `pnpm format` to apply the shared Prettier configuration. Lint covers source, tests and root JavaScript configuration files. ESLint and `@eslint/js` are pinned to matching 9.x releases because the React lint plugin does not yet declare ESLint 10 support. ESLint 9 is deprecated upstream; upgrade the lint packages together when a compatible plugin release is available.

Tests cover random sampling, dictionary integrity, command generation, URL validation, loading recovery and clipboard feedback. Windows command execution checks run on Windows and skip on other platforms. Tests do not open a browser or modify the system clipboard.

Regression coverage also includes out-of-order clipboard responses, manual selection, mode-level error recovery, cached dictionary retries, String bookmarks, batched generation and actual entropy calculations.

For static hosting, use `pnpm build` as the build command and `dist` as the output directory. Preserve your pnpm minimumReleaseAge configuration when installing or updating dependencies.

## Generation and estimates

Random values come from Web Crypto, with rejection sampling for uniform character and word selection. Dictionary assets are checked for the expected size and unique words before use. Invalid bookmark parameters are replaced with canonical values; valid short bookmarks remain supported.

Validated dictionaries are cached as immutable arrays; failed loads are evicted for retry. Preset suffixes and String batches minimise crypto requests. Generated values are kept only in component memory and are never included in bookmarks.

Cracking times are average offline guessing estimates for uniformly generated passwords. The table keeps each row to one line and links to its benchmark source. Hover or focus an algorithm to see its measured settings and any input-length limitations. Actual rates depend on the hash settings, hardware and password length; the large compute profile is a hypothetical multiplier. Character-based generation rounds up to a whole number of characters, so its actual entropy can slightly exceed the selected target.

Bcrypt estimates are unavailable when a configuration can produce passwords longer than 72 bytes, since implementations may truncate or reject them. Dictionary mode uses the longest possible phrase in the validated list, including separators or preset suffixes, rather than the lengths of the current random batch. The benchmark uses optimised kernels with their own password-length limits; estimates are illustrative, not guarantees for every implementation.

The **World compute** profile is a deliberately generous upper bound of 80 million RTX 5090 equivalents. It divides the [IEA's estimate of 415 TWh used by data centres in 2024](https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai) by the [RTX 5090's 575 W graphics power](https://www.nvidia.com/en-au/geforce/graphics-cards/50-series/rtx-5090/), then rounds down. Real cracking capacity would be lower because that electricity also powers CPUs, storage, networking and cooling.

Estimates use unrounded actual entropy. Base64 entropy comes from its input bytes, since its final character can carry fewer than six random bits.

## Interface and styling

The compact neutral interface uses shadcn-style semantic CSS variables. `src/App.css` owns shared tokens, element defaults and self-hosted Geist/Geist Mono font faces. `src/ui.module.css` provides shared panel, field and table styles; component-specific layout lives in adjacent CSS Modules. No external font service is contacted.

Passwords are labelled read-only fields with separate Copy buttons. Focusing a field selects its text for manual copying. Native clipboard failures show persistent instructions; pending copy results cannot restore feedback for replaced passwords. Generation commands appear in the expandable **Generate elsewhere** section.

Contextual help supports hover and keyboard focus, stays open while its text is hovered, and can be dismissed with Escape. Help is positioned outside scrolling containers to avoid clipping and appears to the left of the pointer when there is room, with a right-side or vertical fallback near viewport edges.

Each generator mode has an independent error-boundary lifecycle, so a failed mode does not block navigation to the other mode. Reload remains available to recover stale deployment assets.

## Use of hash routing

This makes it bookmark-friendly with recallable user-selected parameters. The hash formats supported are:

    #/:words
    #/:words/:passphrases
    #/:words/:passphrases/:wordlist
    #/preset1/:words/:passphrases/:wordlist
    #/string?bytes=16&charset=websafe

e.g

    #/4/10/eff-short1

Append this hash to the local URL printed by `pnpm dev`.

If no hash is present, default parameters are used.

String mode accepts `bytes` from 1 to 64 and `charset` values `hex`, `base62`, `websafe`, `human` or `base64`. Slider edits replace the current history entry to avoid adding an entry for every movement. Bookmarks restore settings and generate fresh passwords.

## Credits

- [1Password Agile word list](https://github.com/1Password/spg/blob/208cdea51360df67970a273236aff9e6c12f2d1b/testdata/agwordlist.txt): 18,325 words captured directly from the published text file, preserving its words and order. This is the `spg` repository list, which differs from the current hosted `AgileWords.txt`. Copyright 2018 AgileBits Inc., distributed under Apache 2.0; the licence is included in `public/licences/1password-spg-LICENSE.txt`. No Go code was run to obtain the words. Use `agile` as the word-list bookmark parameter.
- [EFF Dice-Generated Passphrases](https://www.eff.org/dice)
- [Orchard Street Wordlists](https://github.com/sts10/orchard-street-wordlists) by Sam Schlinkert
- [Geist and Geist Mono](https://vercel.com/font) by Vercel, distributed through Fontsource under the SIL Open Font License. Font licences are included in `public/fonts/`.
