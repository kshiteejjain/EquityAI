import { useEffect, useRef } from 'react';

const TopStoriesWidget = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';
      script.innerHTML = JSON.stringify({
        "feedMode": "all_symbols",
        "isTransparent": false,
        "displayMode": "regular",
        "width": "100%",
        "height": "700",
        "colorTheme": "light",
        "locale": "en"
      });

      containerRef?.current?.appendChild(script);

      return () => {
        containerRef?.current?.removeChild(script);
      };
    }
  }, []);

  return (
    <div ref={containerRef}>
      {containerRef.current && (
        <>
          <div className="tradingview-widget-container__widget"></div>
          <div className="tradingview-widget-copyright">
            <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
              <span className="blue-text">Track all markets on TradingView</span>
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default TopStoriesWidget;
