import React from 'react';
import { Icon } from '../_commom/Icon';

const GoTop = ({ scrollStepInPx, delayInMs }) => {
  const [thePosition, setThePosition] = React.useState(false);
  const timeoutRef = React.useRef(null);

  React.useEffect(() => {
    document.addEventListener('scroll', () => {
      if (window.scrollY > 170) {
        setThePosition(true);
      } else {
        setThePosition(false);
      }
    });
  }, []);

  const onScrollStep = () => {
    if (window.pageYOffset === 0) {
      clearInterval(timeoutRef.current);
    }
    window.scroll(0, window.pageYOffset - scrollStepInPx);
  };

  const scrollToTop = () => {
    timeoutRef.current = setInterval(onScrollStep, delayInMs);
  };

  const renderGoTopIcon = () => {
    return (
      <div
        className={`go-top ${thePosition ? 'active' : ''}`}
        onClick={scrollToTop}>
        {/* <Icon.ArrowUp /> */}
        <Icon nameIcon="FaArrowUp" propsIcon={{ size: 24 }} />
      </div>
    );
  };

  return <React.Fragment>{renderGoTopIcon()}</React.Fragment>;
};

export default GoTop;
