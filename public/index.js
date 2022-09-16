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
var mainGroup = new p.Group({
  data: 'main'
});
var addonGroup = new p.Group({
  data: 'addon'
});
var offsetGroup = new p.Group({
  data: 'offset'
});
function initCanvas() {
  mainGroup.removeChildren();
  addonGroup.removeChildren();
  offsetGroup.removeChildren();
}

function drawGotIcon(iconSrc) {
  initCanvas();
  return new Promise(function (resolve, reject) {
    mainGroup.importSVG('ionicons/' + iconSrc.main + '.svg', function (item) {
      mainGroup.fitBounds(new p.Rectangle([0, 0], [512, 512]));

      mainGroup.applyMatrix = true;
      mainGroup.scaling = 0.8;
      mainGroup.strokeColor = '#000000';
      mainGroup.strokeWidth = 1;
      mainGroup.strokeScaling = false;

      // offsetGroup.scaling = 0.8;
      // mainGroup.removeChildren();

      addonGroup.importSVG('ionicons/' + iconSrc.addon + '.svg', function (item) {
        addonGroup.fitBounds(new p.Rectangle([0, 0], [512, 512]));

        offsetGroupPaths(addonGroup, offsetGroup);
        offsetGroup.scaling = 0.4;
        offsetGroup.translate(new p.Point(90, 90));

        addonGroup.applyMatrix = true;
        addonGroup.scaling = 0.4;
        addonGroup.translate(new p.Point(90, 90));
        addonGroup.strokeColor = '#0000FF';
        addonGroup.strokeWidth = 1;
        addonGroup.strokeScaling = false;
        addonGroup.bringToFront();

        var output = cssClasses(paper.project.exportSVG().outerHTML);

        resolve({ svg: output });
      });
    });
  });
}

function offsetGroupPaths(fromGroup, toGroup) {
  var unnested = unnest(fromGroup);
  toGroup.addChildren(unnested);
  var united = offsetPaths(unnested);
  toGroup.removeChildren();
  toGroup.addChildren(united);
}

function offsetPaths(paths) {
  return paths.map(function (path) {
    var strokePath = PaperOffset.offsetStroke(path, 20, { cap: 'round' });
    strokePath.fillColor = 'transparent';
    strokePath.strokeColor = 'blue';
    strokePath.strokeWidth = 1;
    return strokePath;
  });
}

function unnest(item) {
  var result = [];
  if (item.type === 'rectangle' && item.bounds.width === 512 && item.bounds.height === 512) {
    return [];
  }
  if (item instanceof p.Shape) {
    // console.log('SHAPE', item);
    result.push(item.toPath(false));
  } else if (item instanceof p.PathItem || item instanceof p.CompoundPath) {
    // console.log('PATH', item);
    result.push(item.clone({ insert: false }));
  } else if (item.children && item.children.length > 0) {
    // console.log('CHILDREN', item.children);
    item.children.forEach(function (child) {
      // console.log('CHILD', child);
      result.push(unnest(child));
    });
  }

  return result.flat();
}

function cssClasses(svgStr) {
  return svgStr.replace(/data-paper-data="&quot;(.+?)&quot;"/g, 'class="$1"');
  // .replace(/fill="(.+?)" /g, '')
  // .replace(/stroke="(.+?)" /g, '')
  // .replace(/stroke-width="(.+?)" /g, '')
}

var gotIconsLoadedDetail = {
  updateSrc: function (src, currentName) {
    window.dispatchEvent(
      new CustomEvent('gotIconsUpdateSrc', {
        detail: { src: src, currentName: currentName }
      })
    );
  }
};

window.dispatchEvent(new CustomEvent('gotIconsLoaded', { detail: gotIconsLoadedDetail }));
