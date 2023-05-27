import { send } from "./send";

let isStartedRecording = false;
function startRecording(timeStamp: number) {
  if (!isStartedRecording) {
    isStartedRecording = true;
    send("start", {
      time: timeStamp || new Date().valueOf() - NOW,
      viewport: {
        width: visualViewport.width,
        height: visualViewport.height,
        scale: visualViewport.scale,
      },
      mediaQueries: !window.matchMedia
        ? null
        : {
            prefers_reduced_motion: window.matchMedia(
              "(prefers-reduced-motion: reduce)"
            ).matches,
            update: {
              fast: window.matchMedia("(update: fast)").matches,
              slow: window.matchMedia("(update: slow)").matches,
            },
            prefers_contrast: {
              more: window.matchMedia("(prefers-contrast: more)").matches,
              less: window.matchMedia("(prefers-contrast: less)").matches,
            },
            pointer: {
              coarse: window.matchMedia("(pointer: coarse)").matches,
              fine: window.matchMedia("(pointer: fine)").matches,
            },
            display_mode: {
              fullscreen: window.matchMedia("(display-mode: fullscreen)")
                .matches,
              standalone: window.matchMedia("(display-mode: standalone)")
                .matches,
              minimal_ui: window.matchMedia("(display-mode: minimal-ui)")
                .matches,
              browser: window.matchMedia("(display-mode: browser)").matches,
            },
          },
      devicePixelRatio: window.devicePixelRatio,
      ui: {
        menubar: window.menubar?.visible,
        toolbar: window.toolbar?.visible,
        locationbar: window.locationbar?.visible,
        scrollbars: window.scrollbars?.visible,
      },
    });
  }
}
document.addEventListener("readystatechange", function (ev) {
  startRecording(ev.timeStamp);
});

document.addEventListener("DOMContentLoaded", function (ev) {
  startRecording(ev.timeStamp);
});
