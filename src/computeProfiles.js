// The IEA estimates that data centres used 415 TWh in 2024, averaging 47.4 GW.
// Dividing that by an RTX 5090's 575 W graphics power gives about 82 million
// GPUs. Round down to 80 million and treat it as an intentionally generous
// upper bound: real data centres also power CPUs, storage, networking and cooling.
export const WORLD_COMPUTE_MULTIPLIER = 80_000_000;

export const computeProfiles = [
  {
    key: 'single-5090',
    label: '1 × RTX 5090',
    multiplier: 1,
  },
  {
    key: 'world-compute',
    label: 'World compute',
    multiplier: WORLD_COMPUTE_MULTIPLIER,
  },
];

export const WORLD_COMPUTE_DESCRIPTION =
  'Generous upper bound equivalent to 80 million RTX 5090 GPUs running continuously. It converts the IEA’s 415 TWh estimate for all 2024 data-centre electricity into 575 W GPUs; real cracking capacity would be lower because data centres also power CPUs, storage, networking and cooling.';

export const BENCHMARK_DESCRIPTION =
  'Rates come from an RTX 5090 Hashcat benchmark. Some password hashes use the benchmark’s measured work factor; the PBKDF2 row is scaled to 600,000 iterations. Actual rates vary with hardware, password length and hash configuration.';
