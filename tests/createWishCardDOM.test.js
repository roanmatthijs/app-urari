const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

let createWishCardDOM;

beforeAll(() => {
  const html = fs.readFileSync(path.resolve(__dirname, '../generator-urari.html'), 'utf8');
  const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost' });
  createWishCardDOM = dom.window.createWishCardDOM;
});

describe('createWishCardDOM', () => {
  test('returns a DOM element with wish text, copy button and continue button', () => {
    const el = createWishCardDOM('Happy wishes', 'wish-1', 'u1');
    expect(el).not.toBeNull();
    expect(el.querySelector('p.wish-text').textContent).toBe('Happy wishes');
    const copyBtn = el.querySelector('button.btn-copy');
    expect(copyBtn).not.toBeNull();
    expect(copyBtn.getAttribute('aria-label')).toBe(copyBtn.title);
    const heartBtn = el.querySelector('button.btn-favorite');
    expect(heartBtn.getAttribute('aria-label')).toBe(heartBtn.title);
    expect(el.querySelector('button.btn-secondary')).not.toBeNull();
  });

  test('returns a DOM element without continue button when includeActions=false', () => {
    const el = createWishCardDOM('Happy', 'wish-2', 'u2', false, false);
    const copyBtn = el.querySelector('button.btn-copy');
    expect(copyBtn).not.toBeNull();
    expect(copyBtn.getAttribute('aria-label')).toBe(copyBtn.title);
    expect(el.querySelector('button.btn-secondary')).toBeNull();
  });
});
