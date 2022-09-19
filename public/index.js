/** @format */
/* eslint-disable no-undef */

var p = paper;

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

        var offsetPath = offsetGroupPaths(addonGroup, offsetGroup);
        offsetGroup.scaling = 0.4;
        offsetGroup.translate(new p.Point(100, 90));
        // offsetGroup.removeChildren();

        cutGroup(offsetPath, mainGroup);

        mainGroup.strokeCap = 'round';
        mainGroup.strokeJoin = 'round';

        addonGroup.applyMatrix = true;
        addonGroup.scaling = 0.4;
        addonGroup.translate(new p.Point(100, 90));
        addonGroup.strokeColor = '#0000FF';
        addonGroup.strokeWidth = 1;
        addonGroup.strokeScaling = false;
        addonGroup.bringToFront();
        offsetGroup.bringToFront();

        var output = cssClasses(paper.project.exportSVG().outerHTML);

        resolve({ svg: output });
      });
    });
  });
}

function cutGroup(fromPath, toGroup) {
  var unnested = unnest(toGroup);
  toGroup.removeChildren();
  var splitted;
  unnested.forEach(function (part) {
    if (part.intersects(fromPath)) {
      splitted = subtractPaths(part, fromPath, false);
    } else {
      toGroup.addChild(part);
    }
  });
  toGroup.addChild(splitted);
  splitted.strokeWidth = 1;
  splitted.strokeColor = 'black';
}

function subtractPaths(path1, path2, trace) {
  if (path1 instanceof p.Path) {
    return path1.subtract(path2, { insert: false, trace: trace });
  } else if (path1 instanceof p.CompoundPath) {
    var children = path1.removeChildren();
    return new p.CompoundPath({
      children: children
        .map(function (child) {
          if (child.intersects(path2)) {
            var sub = child.subtract(path2, { insert: false, trace: trace });
            // sub.selected = true;
            return sub;
          } else {
            return child;
          }
        })
        .flat()
    });
  }
}

function offsetGroupPaths(fromGroup, toGroup) {
  var unnested = unnest(fromGroup);
  toGroup.addChildren(unnested);
  var offsetPath = offsetPaths(unnested);
  toGroup.removeChildren();
  toGroup.addChildren(offsetPath);
  return offsetPath[1];
}

function offsetPaths(paths) {
  var frameRect;
  var offset;

  paths.forEach(function (path, i) {
    var _frameRect = path.toShape && path.toShape(false);
    if (
      _frameRect &&
      _frameRect.type === 'rectangle' &&
      _frameRect.bounds.width === 512 &&
      _frameRect.bounds.height === 512
    ) {
      frameRect = _frameRect;
      return;
    }
    var thickness = 80;
    var radius = thickness / 2;
    path.curves.forEach(function (curve) {
      var tickCount = Math.ceil(curve.length / (thickness / 4));
      for (i = 0; i <= tickCount; i++) {
        var time = i / tickCount;
        var circle = new p.Path.Circle({
          insert: false,
          center: new p.CurveLocation(curve, time).point,
          radius: radius
        });
        if (offset) {
          offset = offset.unite(circle, { insert: false });
        } else {
          offset = circle;
        }
      }
    });
  });
  offset.fillColor = '#ff000033';
  offset.strokeColor = 'blue';
  offset.strokeWidth = 0;
  return [frameRect, offset];
}

function unnest(item) {
  var result = [];
  if (item instanceof p.Shape) {
    result.push(item.toPath(false));
  } else if (item instanceof p.PathItem) {
    result.push(item.clone({ insert: false }));
  } else if (item.children && item.children.length > 0) {
    item.children.forEach(function (child) {
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
