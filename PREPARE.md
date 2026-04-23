# Evaluation Setup

This file is outside the editable surface. It defines how results are judged. Agents cannot modify the evaluator or the scoring logic — the evaluation is the trust boundary.

Consider defining more than one evaluation criterion. Optimizing for a single number makes it easy to overfit and silently break other things. A secondary metric or sanity check helps keep the process honest.

eval_cores: 1
eval_memory_gb: 1.0
prereq_command: npm run prepare

## Setup

This project is a TypeScript-based implementation of recursive directory creation (like `mkdir -p`). The evaluation measures the performance of both synchronous and asynchronous directory creation operations.

Setup steps:
1. Install dependencies: `npm install`
2. Build TypeScript sources: `npm run prepare` (compiles to `dist/cjs/` and `dist/mjs/`)
3. The `prereq_command` is set to `npm run prepare` to ensure compiled output is measured

The benchmark creates 1000 deeply nested directory structures (5 levels deep) using both async and sync operations, measuring throughput in operations per second.

## Run command

```bash
npm run benchmark
```

This executes `node benchmark/index.js`, which runs the performance test suite.

## Output format

The benchmark prints three metrics:
- `async_ops_per_sec=<number>` — async mkdirp throughput
- `sync_ops_per_sec=<number>` — sync mkdirp throughput  
- `METRIC=<number>` — combined metric (average of async and sync)

The CLI extracts the `METRIC` line as the primary performance indicator.

## Metric parsing

The CLI looks for `METRIC=<number>` or `ops_per_sec=<number>` in the output.

## Ground truth

The baseline metric represents the average operations per second across both async and sync directory creation modes. Higher values indicate better performance. The benchmark creates 1000 directory trees (each 5 levels deep) in isolated temporary directories to measure throughput under realistic workloads.
