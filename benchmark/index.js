const { mkdirp } = require('../dist/cjs/src/index.js');
const { mkdirpSync } = require('../dist/cjs/src/index.js');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Create a unique temp directory for this benchmark run
const baseDir = path.join(os.tmpdir(), `mkdirp-bench-${Date.now()}-${process.pid}`);

function cleanup() {
  try {
    fs.rmSync(baseDir, { recursive: true, force: true });
  } catch (e) {
    // Ignore cleanup errors
  }
}

// Benchmark parameters
const ITERATIONS = 1000;
const DEPTH = 5; // directory depth

async function benchmarkAsync() {
  const start = Date.now();

  for (let i = 0; i < ITERATIONS; i++) {
    const targetPath = path.join(baseDir, 'async', `test-${i}`, 'a', 'b', 'c', 'd');
    await mkdirp(targetPath);
  }

  const elapsed = (Date.now() - start) / 1000;
  return ITERATIONS / elapsed;
}

function benchmarkSync() {
  const start = Date.now();

  for (let i = 0; i < ITERATIONS; i++) {
    const targetPath = path.join(baseDir, 'sync', `test-${i}`, 'a', 'b', 'c', 'd');
    mkdirpSync(targetPath);
  }

  const elapsed = (Date.now() - start) / 1000;
  return ITERATIONS / elapsed;
}

async function main() {
  try {
    // Ensure base directory exists
    fs.mkdirSync(baseDir, { recursive: true });

    // Warm up
    await mkdirp(path.join(baseDir, 'warmup', 'test'));
    mkdirpSync(path.join(baseDir, 'warmup', 'test2'));

    // Run benchmarks
    const asyncOps = await benchmarkAsync();
    const syncOps = benchmarkSync();

    // Calculate combined metric (average of async and sync)
    const totalOps = (asyncOps + syncOps) / 2;

    console.log(`async_ops_per_sec=${asyncOps.toFixed(2)}`);
    console.log(`sync_ops_per_sec=${syncOps.toFixed(2)}`);
    console.log(`METRIC=${totalOps.toFixed(2)}`);

  } finally {
    cleanup();
  }
}

main().catch(err => {
  cleanup();
  console.error('Benchmark failed:', err);
  process.exit(1);
});
