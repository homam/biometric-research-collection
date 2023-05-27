import { send } from "./send";
import { NOW } from "./NOW";

type XYZ<T> = { x: T; y: T; z: T };
type ThreeDPosition = { time: null } | ({ time: number } & XYZ<number | null>);

let accelerationIncludingGravity: ThreeDPosition = { time: null };
let totalAcceleration: { time: null | number } & XYZ<number> = {
  time: null,
  x: 0,
  y: 0,
  z: 0,
};
window.addEventListener("devicemotion", (ev) => {
  {
    const acc = ev.accelerationIncludingGravity;
    if (acc) {
      accelerationIncludingGravity = {
        time: ev.timeStamp || new Date().valueOf() - NOW,
        x: acc.x,
        y: acc.y,
        z: acc.z,
      };
    }
  }
  {
    const acc = ev.acceleration;
    if (acc) {
      totalAcceleration = {
        time: ev.timeStamp || new Date().valueOf() - NOW,
        x: totalAcceleration.x + Math.abs(acc.x || 0),
        y: totalAcceleration.y + Math.abs(acc.y || 0),
        z: totalAcceleration.z + Math.abs(acc.z || 0),
      };
    }
  }
});

setInterval(() => {
  if (
    accelerationIncludingGravity.time != null ||
    totalAcceleration.time != null
  ) {
    send("acceleration", {
      accelerationIncludingGravity,
      totalAcceleration,
    });
  }
}, 500);
