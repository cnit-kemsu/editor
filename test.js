// // const str = 'asdasd 1111<img src="asd" />2222 adasd <img />';
// // const findImg = /<img.*?\/>/g;
// // const findSrc = /src="(?<src>.+)"/g;
// // // const result = str.match(findImg);
// // // console.log(result);

// // function findWithRegex() {
// //   let res;
// //   while ((res = findImg.exec(str)) !== null) {
// //     console.log(findSrc.exec(res[0])?.groups?.src, [res.index, res.index + res[0].length]);
// //   }
// // }

// // findWithRegex();

// // const regex = /222111222/g;
// // const str = 'sdasdasda222111222adasdasd asdasdasd asdasdasd222111222fdsfdsfdsf sdfsdf';
// // console.log(regex.exec(str));
// // console.log(regex.exec(str));
// // console.log(regex.exec(str));

// //const regex = /<img.?*data-entity-key="(?<entityKey>.+?)".*?>/g;
// const regex = /<img.*?data-entity-key="(?<entityKey>.+?)".*?>/g;
// // const str = `
// // <html>
// // <body>
// // <!--StartFragment--><div class="" data-block="true" data-editor="26c3n" data-offset-key="6d0ih-0-0" style="color: rgb(0, 0, 0); font-family: &quot;Times New Roman&quot;; font-size: medium; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"><div data-offset-key="6d0ih-0-0" class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span data-offset-key="6d0ih-0-0"><span data-text="true">1111</span></span><span data-offset-key="6d0ih-1-0" data-entity-key="1" sdfsdfd="5"><img height="50px" src="https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=format%2Ccompress&amp;cs=tinysrgb&amp;dpr=1&amp;w=500"></span><span data-offset-key="6d0ih-2-0"><span data-text="true">222222</span></span></div></div><div class="" data-block="true" data-editor="26c3n" data-offset-key="49pgp-0-0" style="color: rgb(0, 0, 0); font-family: &quot;Times New Roman&quot;; font-size: medium; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"><div data-offset-key="49pgp-0-0" class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span data-offset-key="49pgp-0-0"><span data-text="true">333333</span></span><span data-offset-key="49pgp-1-0" data-entity-key="2"><img height="50px" src="https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=format%2Ccompress&amp;cs=tinysrgb&amp;dpr=1&amp;w=500"></span><span data-offset-key="49pgp-2-0"><span data-text="true">444</span></span></div></div><!--EndFragment-->
// // </body>
// // </html>`;
// const str = `
// <html>
// <body>
// <!--StartFragment--><div class="" data-block="true" data-editor="7oend" data-offset-key="b8t2d-0-0" style="color: rgb(0, 0, 0); font-family: &quot;Times New Roman&quot;; font-size: medium; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"><div data-offset-key="b8t2d-0-0" class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span data-offset-key="b8t2d-0-0"><span data-text="true">111111</span></span><span class="container" data-offset-key="b8t2d-1-0" style="position: relative; display: inline-block;"><span class="crop" style="position: absolute; width: 75.5208px; height: calc(100% - 4px); cursor: move; transition: all 0.25s ease 0s;"><span class="crop-line crop-top-line" style="position: absolute; transition: all 0.25s ease 0s; top: 0px; left: 0px; right: 0px; height: 4px; border-top: 2px solid blue; cursor: n-resize;"></span><span class="crop-line crop-right-line" style="position: absolute; transition: all 0.25s ease 0s; top: 0px; right: 0px; bottom: 0px; width: 4px; border-right: 2px solid blue; cursor: e-resize;"></span><span class="crop-line crop-bottom-line" style="position: absolute; transition: all 0.25s ease 0s; bottom: 0px; left: 0px; right: 0px; height: 4px; border-bottom: 2px solid blue; cursor: s-resize;"></span><span class="crop-line crop-left-line" style="position: absolute; transition: all 0.25s ease 0s; top: 0px; left: 0px; bottom: 0px; width: 4px; border-left: 2px solid blue; cursor: w-resize;"></span><span class="crop-corner crop-top-left-corner" style="position: absolute; width: 6px; height: 6px; border-radius: 2px; border: 1px solid blue; background: lightblue; opacity: 0; transition: all 0.25s ease 0s; top: -3px; left: -3px; cursor: nw-resize;"></span><span class="crop-corner crop-top-right-corner" style="position: absolute; width: 6px; height: 6px; border-radius: 2px; border: 1px solid blue; background: lightblue; opacity: 0; transition: all 0.25s ease 0s; top: -3px; right: -3px; cursor: ne-resize;"></span><span class="crop-corner crop-bottom-right-corner" style="position: absolute; width: 6px; height: 6px; border-radius: 2px; border: 1px solid blue; background: lightblue; opacity: 0; transition: all 0.25s ease 0s; bottom: -3px; right: -3px; cursor: se-resize;"></span><span class="crop-corner crop-bottom-left-corner" style="position: absolute; width: 6px; height: 6px; border-radius: 2px; border: 1px solid blue; background: lightblue; opacity: 0; transition: all 0.25s ease 0s; bottom: -3px; left: -3px; cursor: sw-resize;"></span></span><img data-entity-key="1" src="https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=format%2Ccompress&amp;cs=tinysrgb&amp;dpr=1&amp;w=500" height="50px"></span><span data-offset-key="b8t2d-2-0"><span data-text="true">222222</span></span></div></div><div class="" data-block="true" data-editor="7oend" data-offset-key="874g-0-0" style="color: rgb(0, 0, 0); font-family: &quot;Times New Roman&quot;; font-size: medium; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"><div data-offset-key="874g-0-0" class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span data-offset-key="874g-0-0"><span data-text="true">333333</span></span><span class="container" data-offset-key="874g-1-0" style="position: relative; display: inline-block;"><span class="crop" style="position: absolute; width: 75.5208px; height: calc(100% - 4px); cursor: move; transition: all 0.25s ease 0s;"><span class="crop-line crop-top-line" style="position: absolute; transition: all 0.25s ease 0s; top: 0px; left: 0px; right: 0px; height: 4px; border-top: 2px solid blue; cursor: n-resize;"></span><span class="crop-line crop-right-line" style="position: absolute; transition: all 0.25s ease 0s; top: 0px; right: 0px; bottom: 0px; width: 4px; border-right: 2px solid blue; cursor: e-resize;"></span><span class="crop-line crop-bottom-line" style="position: absolute; transition: all 0.25s ease 0s; bottom: 0px; left: 0px; right: 0px; height: 4px; border-bottom: 2px solid blue; cursor: s-resize;"></span><span class="crop-line crop-left-line" style="position: absolute; transition: all 0.25s ease 0s; top: 0px; left: 0px; bottom: 0px; width: 4px; border-left: 2px solid blue; cursor: w-resize;"></span><span class="crop-corner crop-top-left-corner" style="position: absolute; width: 6px; height: 6px; border-radius: 2px; border: 1px solid blue; background: lightblue; opacity: 0; transition: all 0.25s ease 0s; top: -3px; left: -3px; cursor: nw-resize;"></span><span class="crop-corner crop-top-right-corner" style="position: absolute; width: 6px; height: 6px; border-radius: 2px; border: 1px solid blue; background: lightblue; opacity: 0; transition: all 0.25s ease 0s; top: -3px; right: -3px; cursor: ne-resize;"></span><span class="crop-corner crop-bottom-right-corner" style="position: absolute; width: 6px; height: 6px; border-radius: 2px; border: 1px solid blue; background: lightblue; opacity: 0; transition: all 0.25s ease 0s; bottom: -3px; right: -3px; cursor: se-resize;"></span><span class="crop-corner crop-bottom-left-corner" style="position: absolute; width: 6px; height: 6px; border-radius: 2px; border: 1px solid blue; background: lightblue; opacity: 0; transition: all 0.25s ease 0s; bottom: -3px; left: -3px; cursor: sw-resize;"></span></span><img data-entity-key="2" src="https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=format%2Ccompress&amp;cs=tinysrgb&amp;dpr=1&amp;w=500" height="50px"></span><span data-offset-key="874g-2-0"><span data-text="true">444444</span></span></div></div><!--EndFragment-->
// </body>
// </html>
// `;
// console.log(regex.exec(str));
// console.log(regex.exec(str));
// console.log(regex.exec(str));

// const str = `
// <html>
// <body>
// <!--StartFragment--><img data-symmetric="true" src="https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=format%2Ccompress&cs=tinysrgb&dpr=1&w=500" width="100px" height="undefined" /><!--EndFragment-->
// </body>
// </html>
// `;
// const str = `<img data-symmetric="true" src="https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=format%2Ccompress&cs=tinysrgb&dpr=1&w=500" width="100px" height="undefined" />`;
// //const regex = /<img.*?(\s)*.*?\/>/g;
// const regex = /(\S+?)="(\S+?)"/g;
// console.log(str.match(regex));
// console.log(regex.exec(str));
// console.log(regex.exec(str));
// console.log(regex.exec(str));

const str = `<html>
<body>
<!--StartFragment--><span data-offset-key="9ug4q-0-0" style="color: rgb(0, 0, 0); font-family: &quot;Times New Roman&quot;; font-size: medium; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"><span data-text="true">1</span></span><span class="makeStyles-root-1" data-offset-key="9ug4q-1-0" style="display: inline-block; position: relative; color: rgb(0, 0, 0); font-family: &quot;Times New Roman&quot;; font-size: medium; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"><img data-symmetric="true" src="https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=format%2Ccompress&amp;cs=tinysrgb&amp;dpr=1&amp;w=500" width="100px"></span><span data-offset-key="9ug4q-2-0" style="color: rgb(0, 0, 0); font-family: &quot;Times New Roman&quot;; font-size: medium; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"><span data-text="true">222</span></span><!--EndFragment-->
</body>
</html>`;
const regex = /<img.+?>/g;
console.log(regex.exec(str));

// const str = `123 aaa! aaa! 123123 aaa! 12323`;
// const regex = /.*?<(aaa!)>.*?/g;
// console.log(regex.exec(str));
//console.log(regex.exec(str));
//console.log(regex.exec(str));
// const res = 'Gogogo now!'.match(/(go)+/i);
// console.log(res);


// HTML  CSS  JS Result
// EDIT ON
//  /*Make resizable div by Hung Nguyen*/
// function makeResizableDiv(div) {
//   const element = document.querySelector(div);
//   const resizers = document.querySelectorAll(div + ' .resizer')
//   const minimum_size = 20;
//   let original_width = 0;
//   let original_height = 0;
//   let original_x = 0;
//   let original_y = 0;
//   let original_mouse_x = 0;
//   let original_mouse_y = 0;
//   for (let i = 0;i < resizers.length; i++) {
//     const currentResizer = resizers[i];
//     currentResizer.addEventListener('mousedown', function(e) {
//       e.preventDefault()
//       original_width = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
//       original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
//       original_x = element.getBoundingClientRect().left;
//       original_y = element.getBoundingClientRect().top;
//       original_mouse_x = e.pageX;
//       original_mouse_y = e.pageY;
//       window.addEventListener('mousemove', resize)
//       window.addEventListener('mouseup', stopResize)
//     })
    
//     function resize(e) {
//       if (currentResizer.classList.contains('bottom-right')) {
//         const width = original_width + (e.pageX - original_mouse_x);
//         const height = original_height + (e.pageY - original_mouse_y)
//         if (width > minimum_size) {
//           element.style.width = width + 'px'
//         }
//         if (height > minimum_size) {
//           element.style.height = height + 'px'
//         }
//       }
//       else if (currentResizer.classList.contains('bottom-left')) {
//         const height = original_height + (e.pageY - original_mouse_y)
//         const width = original_width - (e.pageX - original_mouse_x)
//         if (height > minimum_size) {
//           element.style.height = height + 'px'
//         }
//         if (width > minimum_size) {
//           element.style.width = width + 'px'
//           element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
//         }
//       }
//       else if (currentResizer.classList.contains('top-right')) {
//         const width = original_width + (e.pageX - original_mouse_x)
//         const height = original_height - (e.pageY - original_mouse_y)
//         if (width > minimum_size) {
//           element.style.width = width + 'px'
//         }
//         if (height > minimum_size) {
//           element.style.height = height + 'px'
//           element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
//         }
//       }
//       else {
//         const width = original_width - (e.pageX - original_mouse_x)
//         const height = original_height - (e.pageY - original_mouse_y)
//         if (width > minimum_size) {
//           element.style.width = width + 'px'
//           element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
//         }
//         if (height > minimum_size) {
//           element.style.height = height + 'px'
//           element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
//         }
//       }
//     }
    
//     function stopResize() {
//       window.removeEventListener('mousemove', resize)
//     }
//   }
// }

// makeResizableDiv('.resizable')

// Resources 1×0.5×0.25× Rerun

`<html>
<body>
<!--StartFragment-->

<span>

<img src="https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=format%2Ccompress&cs=tinysrgb&dpr=1&w=500" width="100px" data-symmetric="true" />

</span>

<!--EndFragment-->
</body>
</html>`

`<html>
<body>
<!--StartFragment-->

<span data-offset-key="f7f0t-2-0" style="color: rgb(0, 0, 0); font-family: &quot;Times New Roman&quot;; font-size: medium; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;">
<span data-text="true">b</span>
</span>

<span data-offset-key="f7f0t-3-0" style="color: rgb(0, 0, 0); font-family: &quot;Times New Roman&quot;; font-size: medium; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;">

<span class="makeStyles-root-1" style="display: inline-block; position: relative;">


  <img data-symmetric="true" src="https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto" width="100px">


</span>

</span>

<span data-offset-key="f7f0t-4-0" style="color: rgb(0, 0, 0); font-family: &quot;Times New Roman&quot;; font-size: medium; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;">
  <span data-text="true">b</span>
</span>

<!--EndFragment-->
</body>
</html>`