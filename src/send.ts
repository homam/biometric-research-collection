import { RealtimeChannel } from "@supabase/supabase-js";
import * as telemetry from "./telemetry";

let channel: RealtimeChannel | null = null;
telemetry
  .newVisitor(localStorage.getItem("channelName"))
  .then(({ user, channel: nchannel }) => {
    console.log("user", user);
    channel = nchannel as RealtimeChannel;
    channel.on("broadcast", { event: "telemetry" }, (payload) => {
      console.log("channel broadcat telemetry", payload);
    });
    channel.on("presence", { event: "sync" }, () => {
      console.log("Online users: ", channel.presenceState());
    });

    channel.on("presence", { event: "join" }, ({ newPresences }) => {
      console.log("New users have joined: ", newPresences);
    });

    channel.on("presence", { event: "leave" }, ({ leftPresences }) => {
      console.log("Users have left: ", leftPresences);
    });
  })
  .catch(console.log);

export function send(eventType: string, event: Record<string, unknown>) {
  if (channel) {
    channel.send({
      type: "broadcast",
      event: eventType,
      ...event,
    });
  }
}
