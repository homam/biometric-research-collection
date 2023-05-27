document.getElementById("channelNameForm")?.addEventListener("submit", (ev) => {
  ev.preventDefault();
  localStorage.setItem(
    "channelName",
    (document.getElementById("channelName") as HTMLInputElement).value
  );
  window.location.reload();
});
(document.getElementById("channelName") as HTMLInputElement).value =
  localStorage.getItem("channelName") || "";
