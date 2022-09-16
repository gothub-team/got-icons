/** @format */
/* eslint-disable no-undef */

var p = paper;

// /* #region  old */
// var originals = new p.Group({ insert: false }); // Don't insert in DOM.
// var square = new p.Path.Rectangle({
//     position: view.center,
//     size: 500,
//     parent: originals,
//     fillColor: 'black'
// });

// // Make a ring using subtraction of two circles:
// var inner = new p.Path.Circle({
//     center: view.center,
//     radius: 100,
//     parent: originals,
//     fillColor: 'black'
// });

// var outer = new p.Path.Circle({
//     center: view.center,
//     radius: 140,
//     parent: originals,
//     fillColor: 'black'
// });

// var ring = outer.subtract(inner);

// var offset = new p.Point(120, 80);
// ring.position = view.center + offset;
// /* #endregion */

// var result = square.subtract(ring);

// result.selected = false;
// result.fillColor = 'black';
// result.addTo(paper.project);

// result.data = 'test-class';

function asyncSeqForEach(arr, fnForEach) {
  if (arr[0]) {
    return fnForEach(arr[0]).then(function () {
      return asyncSeqForEach(arr.slice(1), fnForEach);
    });
  }
}

window.addEventListener('gotIconsUpdateSrc', function (e) {
  var src = e.detail.src;
  var currentName = e.detail.currentName;
  var svg = {};
  asyncSeqForEach(Object.keys(src), function (name) {
    return drawGotIcon(src[name]).then(function (result) {
      svg[name] = result.svg;
    });
  }).then(function () {
    window.dispatchEvent(new CustomEvent('gotIconsUpdateSvg', { detail: svg }));
    currentName && drawGotIcon(src[currentName]);
  });
});

var backCircle = new p.Path.Circle({
  center: view.center,
  radius: 256,
  fillColor: '#EEEEEE',
  strokeScaling: false,
  data: 'back-circle'
});
var mainGroup;
var addonGroup;
function initCanvas() {
  mainGroup && mainGroup.remove();
  addonGroup && addonGroup.remove();
  mainGroup = new p.Group({
    data: 'main'
  });
  addonGroup = new p.Group({
    data: 'addon'
  });
}

function drawGotIcon(iconSrc) {
  initCanvas();
  return new Promise(function (resolve, reject) {
    mainGroup.importSVG('ionicons/' + iconSrc.main + '.svg', function (item) {
      mainGroup.applyMatrix = false;
      mainGroup.scaling = 0.8;
      mainGroup.strokeColor = '#000000';
      mainGroup.strokeWidth = 1;
      mainGroup.strokeScaling = false;

      addonGroup.importSVG('ionicons/' + iconSrc.addon + '.svg', function (item) {
        addonGroup.applyMatrix = false;
        addonGroup.scaling = 0.4;
        addonGroup.strokeColor = '#0000FF';
        addonGroup.strokeWidth = 1;
        addonGroup.strokeScaling = false;
        addonGroup.translate(new p.Point(90, 90));

        var output = cssClasses(paper.project.exportSVG().outerHTML);

        resolve({ svg: output });
      });
    });
  });
}

function cssClasses(svgStr) {
  return svgStr.replace(/data-paper-data="&quot;(.+?)&quot;"/g, 'class="$1"');
  // .replace(/fill="(.+?)" /g, '')
  // .replace(/stroke="(.+?)" /g, '')
  // .replace(/stroke-width="(.+?)" /g, '')
}

var gotIconsLoadedDetail = {
  updateSrc: function (src, currentName) {
    var event = new CustomEvent('gotIconsUpdateSrc', {
      detail: { src: src, currentName: currentName }
    });
    window.dispatchEvent(event);
  }
};

window.dispatchEvent(new CustomEvent('gotIconsLoaded', { detail: gotIconsLoadedDetail }));
