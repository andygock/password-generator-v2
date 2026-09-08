// @vitest-environment node
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { CHARSETS } from '../src/charsets';
import { getCommands } from '../src/commands';
import { benchmarks } from '../src/benchmarks';

function checkPassword(password, charset, bits) {
  const expected =
    charset.key === 'base64'
      ? Math.ceil(bits / 6)
      : Math.ceil(bits / Math.log2(charset.charset.length));
  expect(password.length).toBe(expected);
  expect(
    Array.from(password).every((character) =>
      charset.charset.includes(character)
    )
  ).toBe(true);
}

describe('executable command templates', () => {
  for (const charset of CHARSETS) {
    it(`generates valid ${charset.key} in Node and browser JavaScript`, () => {
      for (const bits of [8, 128, 512]) {
        const commands = getCommands(charset.key, bits);
        const node = commands.find((row) => row.language === 'Node.js').command;
        const nodeResult = vm.runInNewContext(node + '\npassphrase;', {
          require: createRequire(import.meta.url),
        });
        checkPassword(nodeResult, charset, bits);
        const browser = commands.find(
          (row) => row.language === 'Browser JS'
        ).command;
        const expression = ['hex', 'base64'].includes(charset.key)
          ? browser
          : browser + '\npassphrase;';
        checkPassword(
          vm.runInNewContext(expression, {
            window: { crypto: webcrypto },
            btoa,
          }),
          charset,
          bits
        );
      }
    });

    it.skipIf(process.platform !== 'win32')(
      `runs ${charset.key} in Windows PowerShell and CMD`,
      () => {
        // Shadow clipboard writes in the child process; tests never replace the
        // user's clipboard or print generated secrets in the test output.
        const clipboardStub =
          "$ProgressPreference='SilentlyContinue';function Set-Clipboard { param([Parameter(ValueFromPipeline)]$Value) process {} };";
        for (const bits of [8, 128, 512]) {
          const commands = getCommands(charset.key, bits);
          const script = commands.find(
            (row) => row.language === 'PowerShell*'
          ).command;
          const password = execFileSync(
            'powershell.exe',
            [
              '-NoProfile',
              '-NonInteractive',
              '-EncodedCommand',
              Buffer.from(
                "$ErrorActionPreference='Stop';" + clipboardStub + script,
                'utf16le'
              ).toString('base64'),
            ],
            { encoding: 'utf8', windowsHide: true }
          ).trim();
          checkPassword(password, charset, bits);
        }
        const cmd = getCommands(charset.key, 128).find(
          (row) => row.language === 'Windows CMD*'
        ).command;
        const safeCmd = cmd.replace(
          'powershell -Command "',
          'powershell -NoProfile -NonInteractive -Command "' + clipboardStub
        );
        const password = execFileSync(
          'cmd.exe',
          ['/d', '/v:on', '/s', '/c', '"' + safeCmd + '"'],
          {
            encoding: 'utf8',
            windowsHide: true,
            windowsVerbatimArguments: true,
          }
        ).trim();
        checkPassword(password, charset, 128);
      },
      20000
    );
  }
});

it('keeps benchmark identities, settings and rates explicit', () => {
  expect(new Set(benchmarks.map((row) => row.hashMode)).size).toBe(
    benchmarks.length
  );
  expect(benchmarks.every((row) => row.settings && row.rate > 0)).toBe(true);
  expect(benchmarks.find((row) => row.hashMode === 7500).name).toContain(
    'AS-REQ'
  );
  expect(
    benchmarks
      .find((row) => row.hashMode === 11600)
      .links.map((link) => link.label)
  ).toEqual(['7-Zip']);
  expect(benchmarks.find((row) => row.hashMode === 3200).settings).toContain(
    'Cost 5'
  );
});
