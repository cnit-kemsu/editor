// let str = `<div data-block="true" data-editor="14mth" data-offset-key="at0lv-0-0" style="color: rgb(0, 0, 0); font-family: &quot;Times New Roman&quot;; font-size: medium; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;">
// <div data-offset-key="at0lv-0-0" class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr">
//   <span data-offset-key="at0lv-2-0">
//     <span data-text="true">2</span>
//   </span>
//   <span data-offset-key="at0lv-2-1" style="color: rgb(255, 64, 0);">
//     <span data-text="true">22</span>
//   </span>
//   <span data-offset-key="at0lv-2-2">
//     <span data-text="true">22</span>
//   </span>
// </div>
// </div>
// <div data-block="true" data-editor="14mth" data-offset-key="aiml3-0-0" style="color: rgb(0, 0, 0); font-family: &quot;Times New Roman&quot;; font-size: medium; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;">
// <div data-offset-key="aiml3-0-0" class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr">
//   <span data-offset-key="aiml3-0-0">
//     <span data-text="true">333333</span>
//   </span>
// </div>
// </div>`;
// str = str.replace(/\n/g, '');
// const findBlock = /<div data-block="true".*?>.*?<div.*?>(?<content>.*?)<\/div>.*?<\/div>/g;
// const block = findBlock.exec(str).groups.content;
// console.log(block);
// const findUnit = /<span data-offset-key=".*?style="(?<style>.*?)".*?>.*?<span.*?>(?<text>.*?)<\/span>.*?<\/span>/g;
// const unit = findUnit.exec(block).groups;
// console.log(unit);
// const findStyle = /(?<attrName>.*?)\s*?:\s*?(?<attrValue>.*?)\s*?;/g;
// const style = findStyle.exec(unit.style).groups;
// console.log(style);

// console.log(
//   ['color', 'background-color', 'textDecoration'].includes('color')
// );

const html = `
  <span style="asd">111</span>
`;
const fragment = /<span.*?style="(?<style>.*?)".*?>(?<text>.*?)<\/span>/g.exec(html);
console.log(fragment);