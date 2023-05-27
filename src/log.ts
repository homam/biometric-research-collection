const logElement = document.getElementById("logElement") as HTMLElement;
export function log(msg: string) {
  logElement.innerHTML = msg + "\n" + logElement.innerHTML;
}
