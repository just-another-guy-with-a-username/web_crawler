import { JSDOM } from "jsdom";

function normalizeURL(url) {
  const urlObj = new URL(url);
  let fullPath = `${urlObj.host}${urlObj.pathname}`;
  if (fullPath.slice(-1) === '/') {
    fullPath = fullPath.slice(0, -1);
  };
  return fullPath;
};

function getURLsFromHTML(html, baseURL) {
  const urls = [];
  const dom = new JSDOM(html);
  const anchors = Array.from(dom.window.document.querySelectorAll('a'));
  for (const anchor of anchors) {
    if (anchor.hasAttribute('href')) {
      let href = anchor.getAttribute('href');
      try {
        href = new URL(href, baseURL).href;
        urls.push(href);
      } catch (err) {
        console.log(`${err.message}: ${href}`);
      }
    }
  }
  return urls;
}

async function crawlPage(baseURL, currentURL = baseURL, pages = {}) {
  const currentURLObj = new URL(currentURL);
  const baseURLObj = new URL(baseURL);
  if (currentURLObj.hostname !== baseURLObj.hostname) {
    return pages;
  };
  let page = null;
  try {
    page = await fetch(currentURL);
  } catch (err) {
    console.log(currentURL);
    throw new Error(`${err.message}`);
  };
  if (page.status > 399) {
    console.log(`${page.status} ${page.statusText}`);
    return pages;
  };
  const contentType = page.headers.get('content-type');
  if (!contentType || !contentType.includes('text/html')) {
    console.log(`content not HTML: ${contentType}`);
    return pages;
  };
  const normalizedCurrentURL = normalizeURL(currentURL);
  if (normalizedCurrentURL in pages) {
    pages[normalizedCurrentURL]++;
    return pages;
  };
  pages[normalizedCurrentURL] = 1;
  const htmlContent = await page.text();
  const urlsToCheck = getURLsFromHTML(htmlContent, baseURL);
  for (const checkingURL of urlsToCheck) {
    pages = await crawlPage(baseURL, checkingURL, pages);
  };
  return pages;
};

export { normalizeURL, getURLsFromHTML, crawlPage };
