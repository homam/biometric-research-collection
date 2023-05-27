import { NOW } from "./NOW";
import "./style.css";
import { log } from "./log";
import "./header";
import { send } from "./send";
import "./start";
import "./devicemotion";

type TwoDCoordinate = {
  x: number;
  y: number;
};
type MouseCoordinates = {
  screen: TwoDCoordinate;
  page: TwoDCoordinate;
  client: TwoDCoordinate;
  offset: TwoDCoordinate;
};
type LastTwoDCoordinateEvent =
  | {
      time: null;
    }
  | ({
      time: number;
    } & MouseCoordinates);

type LastMoveMouseEvent =
  | { time: null }
  | ({
      time: number;
      totalMouseMovement: { x: number; y: number };
    } & MouseCoordinates);

type LastTouchEvent =
  | {
      time: null;
    }
  | {
      time: number;
      screen: TwoDCoordinate;
      page: TwoDCoordinate;
      client: TwoDCoordinate;
      radius: TwoDCoordinate;
      force: number;
      rotationAngle: number;
      identifier: number;
    };

let touchStart: LastTouchEvent = {
  time: null,
};

let touchMove: LastTouchEvent = {
  time: null,
};

let touchEnd: LastTouchEvent = {
  time: null,
};

let isTouchStarted = false;
let isMouseDown = false;
let touchMoveStats: null | {
  radius: {
    max: TwoDCoordinate;
    min: TwoDCoordinate;
  };
  force: {
    max: number;
    min: number;
  };
} = null;

let mousedown: LastTwoDCoordinateEvent = {
  time: null,
};
let mouseup: LastTwoDCoordinateEvent = {
  time: null,
};
let mousemove: LastTwoDCoordinateEvent = {
  time: null,
};
function onMouseEvent({
  mousedown,
  mousemove,
  mouseup,
}: {
  mousedown?: LastTwoDCoordinateEvent;
  mousemove?: LastMoveMouseEvent;
  mouseup?: LastTwoDCoordinateEvent;
}) {
  send("mouseClick", {
    down: mousedown,
    move: mousemove,
    up: mouseup,
  });
}

document.addEventListener("mousedown", (ev) => {
  isMouseDown = true;
  mouseup = {
    time: null,
  };
  mousedown = {
    time: ev.timeStamp || new Date().valueOf() - NOW,
    screen: {
      x: ev.screenX,
      y: ev.screenY,
    },
    page: {
      x: ev.pageX,
      y: ev.pageY,
    },
    offset: {
      x: ev.offsetX,
      y: ev.offsetY,
    },
    client: {
      x: ev.clientX,
      y: ev.clientY,
    },
  };
});

let isMouseMoving = false;
let totalMouseMovement = {
  x: 0,
  y: 0,
};
document.addEventListener("mousemove", (ev) => {
  mousemove = {
    time: ev.timeStamp || new Date().valueOf() - NOW,
    screen: {
      x: ev.screenX,
      y: ev.screenY,
    },
    page: {
      x: ev.pageX,
      y: ev.pageY,
    },
    offset: {
      x: ev.offsetX,
      y: ev.offsetY,
    },
    client: {
      x: ev.clientX,
      y: ev.clientY,
    },
  };
  totalMouseMovement = {
    x: totalMouseMovement.x + Math.abs(ev.movementX),
    y: totalMouseMovement.y + Math.abs(ev.movementY),
  };
});

setInterval(() => {
  if (mousemove.time != null) {
    send("mousemove", {
      ...mousemove,
      totalMouseMovement,
    });
    mousemove = {
      time: null,
    };
  }
  totalMouseMovement = {
    x: 0,
    y: 0,
  };
}, 500);
setInterval;

document.addEventListener("mouseup", (ev) => {
  isMouseDown = false;
  mouseup = {
    time: ev.timeStamp || new Date().valueOf() - NOW,
    screen: {
      x: ev.screenX,
      y: ev.screenY,
    },
    page: {
      x: ev.pageX,
      y: ev.pageY,
    },
    offset: {
      x: ev.offsetX,
      y: ev.offsetY,
    },
    client: {
      x: ev.clientX,
      y: ev.clientY,
    },
  };
  onMouseEvent({ mousedown, mouseup });
  mousedown = {
    time: null,
  };
});

function onTouchCompleted(
  touchStart: LastTouchEvent,
  touchMove: LastTouchEvent,
  touchEnd: LastTouchEvent
) {
  log(
    JSON.stringify(
      {
        touchStart,
        touchMove,
        touchEnd,
      },
      null,
      2
    )
  );
  send("touchEnd", {
    start: touchStart,
    end: touchEnd,
  });
}

document.addEventListener("touchstart", (ev) => {
  isTouchStarted = true;
  touchMove = {
    time: null,
  };
  touchEnd = {
    time: null,
  };
  const touch0 = ev.touches[0];
  touchStart = {
    time: ev.timeStamp || new Date().valueOf() - NOW,
    screen: {
      x: touch0.screenX,
      y: touch0.screenY,
    },
    page: {
      x: touch0.pageX,
      y: touch0.pageY,
    },
    radius: {
      x: touch0.radiusX,
      y: touch0.radiusX,
    },
    force: touch0.force,
    rotationAngle: touch0.rotationAngle,
    identifier: touch0.identifier,
    client: {
      x: touch0.clientX,
      y: touch0.clientY,
    },
  };
});

document.addEventListener("touchmove", (ev) => {
  const touch0 = ev.touches[0];
  touchMove = {
    time: ev.timeStamp || new Date().valueOf() - NOW,
    screen: {
      x: touch0.screenX,
      y: touch0.screenY,
    },
    page: {
      x: touch0.pageX,
      y: touch0.pageY,
    },
    radius: {
      x: touch0.radiusX,
      y: touch0.radiusX,
    },
    force: touch0.force,
    rotationAngle: touch0.rotationAngle,
    identifier: touch0.identifier,
    client: {
      x: touch0.clientX,
      y: touch0.clientY,
    },
  };
});

document.addEventListener("touchend", (ev) => {
  const touch0 = ev.changedTouches[0];
  touchEnd = {
    time: ev.timeStamp || new Date().valueOf() - NOW,
    screen: {
      x: touch0.screenX,
      y: touch0.screenY,
    },
    page: {
      x: touch0.pageX,
      y: touch0.pageY,
    },
    radius: {
      x: touch0.radiusX,
      y: touch0.radiusX,
    },
    force: touch0.force,
    rotationAngle: touch0.rotationAngle,
    identifier: touch0.identifier,
    client: {
      x: touch0.clientX,
      y: touch0.clientY,
    },
  };
  isTouchStarted = false;
  onTouchCompleted(touchStart, touchMove, touchEnd);
  touchStart = { time: null };
  touchMove = { time: null };
});

type LastScrollEvent =
  | { time: null }
  | {
      time: number;
      scroll: TwoDCoordinate;
    };
let scrollStart: LastScrollEvent = { time: null };
let scrollEnd: LastScrollEvent = { time: null };
function onScrollCompleted(
  scrollStart: LastScrollEvent,
  scrollEnd: LastScrollEvent
) {
  log(
    JSON.stringify(
      {
        scrollStart,
        scrollEnd,
      },
      null,
      2
    )
  );
  send("scrollEnd", {
    start: scrollStart,
    end: scrollEnd,
  });
}
document.addEventListener("scroll", (ev) => {
  scrollEnd = { time: null };
  scrollStart = {
    time: ev.timeStamp || new Date().valueOf() - NOW,
    scroll: {
      x: window.scrollX,
      y: window.scrollY,
    },
  };
});
document.addEventListener("scrollend", (ev) => {
  scrollEnd = {
    time: ev.timeStamp || new Date().valueOf() - NOW,
    scroll: {
      x: window.scrollX,
      y: window.scrollY,
    },
  };
  onScrollCompleted(scrollStart, scrollEnd);
  scrollStart = { time: null };
});
