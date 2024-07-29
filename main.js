import { crawlPage } from './crawl.js';
import { printReport } from './report.js';

async function main() {
  if (process.argv.length < 3 || process.argv.length > 3) {
    console.log(`expected number of websites: 1. websites given ${process.argv.length - 2}`);
    return;
  };
  const url = process.argv[2];
  console.log(`crawling ${url}`);
  printReport(await crawlPage(url));
};

main();
