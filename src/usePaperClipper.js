/** @format */
import 'path-browserify';
import { clipperLib, clipperOffset } from 'paper-clipper';
import { useCallback, useEffect } from 'react';

export const usePaperClipper = () => {
  //   const init = useCallback(async () => {
  //     const clipper = await clipperLib.loadNativeClipperLibInstanceAsync(
  //       clipperLib.NativeClipperLibRequestedFormat.WasmWithAsmJsFallback,
  //     );
  //     window.dispatchEvent(
  //       new CustomEvent('paperClipperInitialized', {
  //         detail: { clipperOffset: clipperOffset(clipper) },
  //       }),
  //     );
  //   }, []);
  //   useEffect(() => {
  //     init();
  //   });
};
