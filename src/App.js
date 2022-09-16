/** @format */

import { useEffect, useRef, useState } from 'react';
import './App.css';

const useGotIcons = () => {
  const updateSrcRef = useRef(() => {});
  const [src, setSrc] = useState({});
  const [svg, setSvg] = useState({});
  const [currentName, setCurrentName] = useState();
  const gotIconsLoaded = ({ detail: { updateSrc } }) => {
    updateSrc(src);
    updateSrcRef.current = updateSrc;
  };
  const gotIconsUpdateSvg = ({ detail }) => {
    setSvg(detail);
  };
  useEffect(() => {
    window.addEventListener('gotIconsLoaded', gotIconsLoaded);
    window.addEventListener('gotIconsUpdateSvg', gotIconsUpdateSvg);
    return () => {
      window.removeEventListener('gotIconsLoaded', gotIconsLoaded);
      window.removeEventListener('gotIconsUpdateSvg', gotIconsUpdateSvg);
    };
  });

  useEffect(() => {
    updateSrcRef.current(src, currentName);
  }, [src, currentName]);

  return {
    src,
    setSrc,
    svg,
    currentName,
    setCurrentName,
  };
};

function App() {
  const { svg, setSrc, currentName, setCurrentName } = useGotIcons();
  useEffect(() => {
    setSrc({
      'bike-add': {
        main: 'bicycle-outline',
        addon: 'add',
      },
      'person-warn': {
        main: 'accessibility-outline',
        addon: 'warning',
      },
      'person-add': {
        main: 'accessibility-outline',
        addon: 'add',
      },
      'person-add-1': {
        main: 'accessibility-outline',
        addon: 'add',
      },
      'person-add-2': {
        main: 'accessibility-outline',
        addon: 'add',
      },
      'person-add-3': {
        main: 'wifi-outline',
        addon: 'water',
      },
      'person-add-4': {
        main: 'accessibility-outline',
        addon: 'add',
      },
      'person-add-5': {
        main: 'accessibility-outline',
        addon: 'add',
      },
    });
  }, [setSrc]);
  return (
    <>
      <div id="icons">
        {Object.keys(svg).map(name => (
          <div key={name} onClick={() => setCurrentName(name)}>
            <div className="icon" dangerouslySetInnerHTML={{ __html: svg[name] }} />
            <div>{name}</div>
          </div>
        ))}
      </div>
      <div id="current-icon" dangerouslySetInnerHTML={{ __html: svg[currentName] }} />
    </>
  );
}

export default App;
