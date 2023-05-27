import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  "https://bnpndeyqgieoapeqhfll.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJucG5kZXlxZ2llb2FwZXFoZmxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODUxMDI3NDMsImV4cCI6MjAwMDY3ODc0M30.hwODZJIC_b-mV5gW4QKgiLVkYUa6dR-Epg8XlT4JCzI",
  {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

export async function newVisitor(channelName: string | undefined | null) {
  const { data, error } = await supabase.auth.getSession();
  if (data.session?.user) {
    const channel = supabase.channel(
      channelName || (data.session.user.email as string),
      {
        config: { broadcast: { ack: true, self: true } },
      }
    );
    channel.subscribe((...args) => {
      console.log("channel", args);
    });
    return { user: data.session.user, channel };
  } else {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://bnpndeyqgieoapeqhfll.supabase.co/auth/v1/callback",
      },
    });
  }

  // return supabase.from("visitors").insert({ name }).select();
}
