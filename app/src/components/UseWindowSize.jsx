
// https://stackoverflow.com/questions/19014250/rerender-view-on-browser-resize-with-react

import { useLayoutEffect, useState } from 'react';


export function useWindowSize(id) {
  const [size, setSize] = useState([0, 0]);

  useLayoutEffect(() => {
    
    const main = document.getElementById(id)
    if (!main) return
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const {width, height} = entry.contentRect;
        setSize([width, height])
      }
    })

    resizeObserver.observe(main)

    return () => {
      resizeObserver.disconnect()
    }

  }, []);
  return size;
}

