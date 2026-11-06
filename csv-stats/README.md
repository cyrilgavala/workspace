# csv-stats — CSV stats CLI (Node built-ins only)

Reads a CSV and prints `count`, `min`, `max`, `average` for a chosen numeric column.
No dependencies — `node:fs` plus a small quoted-CSV parser.

## Usage
```bash
node cli.js <file> <column>
# <column> is a header name or a 0-based index
node cli.js sample.csv amount
node cli.js sample.csv 1
```

## Verify
```bash
cd csv-stats
node cli.js sample.csv amount      # prints the stats
node cli.js                        # prints the usage message
node cli.js no-such.csv amount     # prints a file-not-found error
```

Empty or non-numeric cells in the column are skipped (with a note); a column with no
numeric values is an error. Missing file or column prints an error and a non-zero exit.

## Tests
```bash
cd csv-stats
npm test          # node --test on the pure parse/stats functions
```
