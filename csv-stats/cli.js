#!/usr/bin/env node
'use strict';

const fs = require('node:fs');

function usage() {
  console.error('Usage: node cli.js <file> <column>\n');
  console.error('  <file>    path to a CSV file');
  console.error('  <column>  header name (or 0-based index) to summarize as numbers');
  process.exit(1);
}

// Minimal CSV parse: splits on commas/newlines, honors double-quoted fields that may
// contain commas or escaped ("") quotes.
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else field += c;
  }
  if (field !== '' || row.length > 0) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((cell) => cell !== ''));
}

// Summary of a list of numbers.
function stats(values) {
  const sum = values.reduce((a, b) => a + b, 0);
  return {
    count: values.length,
    min: Math.min(...values),
    max: Math.max(...values),
    average: Math.round((sum / values.length) * 100) / 100,
  };
}

function main(argv) {
  const file = argv[2];
  const column = argv[3];
  if (!file || !column) usage();

  let text;
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch {
    console.error(`Error: cannot read file "${file}"`);
    process.exit(1);
  }

  const rows = parseCsv(text);
  if (rows.length === 0) {
    console.error('Error: CSV has no data');
    process.exit(1);
  }

  // Resolve the column by 0-based index if the arg is a bare number, else by header name.
  const header = rows[0];
  const asIndex = Number(column);
  let idx;
  if (Number.isInteger(asIndex) && String(asIndex) === column && asIndex >= 0 && asIndex < header.length) {
    idx = asIndex;
  } else {
    idx = header.indexOf(column);
    if (idx === -1) {
      console.error(`Error: column "${column}" not found. Available: ${header.join(', ')}`);
      process.exit(1);
    }
  }

  const values = [];
  let skipped = 0;
  for (const row of rows.slice(1)) {
    const raw = (row[idx] ?? '').trim();
    if (raw === '' || Number.isNaN(Number(raw))) { skipped++; continue; }
    values.push(Number(raw));
  }
  if (values.length === 0) {
    console.error('Error: no numeric values found in that column');
    process.exit(1);
  }

  const s = stats(values);
  console.log(`column: ${header[idx]} (${s.count} value${s.count === 1 ? '' : 's'})`);
  console.log(`min:     ${s.min}`);
  console.log(`max:     ${s.max}`);
  console.log(`average: ${s.average}`);
  if (skipped > 0) console.log(`skipped: ${skipped} non-numeric/empty cell(s)`);
}

module.exports = { parseCsv, stats };

// Only run as a CLI when invoked directly, so tests can import the pure functions.
if (require.main === module) main(process.argv);
