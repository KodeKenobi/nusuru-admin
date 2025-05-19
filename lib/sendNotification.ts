import { supabase } from "./supabase";

export const sendTestNotification = async (
  token: string,
  title?: string,
  body?: string
) => {
  try {
    console.log("Sending notification with:", { token, title, body });

    const { data, error } = await supabase.functions.invoke(
      "send-notification",
      {
        body: {
          token,
          notification: {
            title: title || "Test Notification",
            body: body || "This is a test notification from your app!",
          },
          data: {
            type: "test",
            timestamp: new Date().toISOString(),
          },
        },
      }
    );

    if (error) {
      console.error("Supabase function error:", error);
      throw error;
    }

    console.log("Notification response:", data);
    return data;
  } catch (error) {
    console.error("Error in sendTestNotification:", error);
    throw error;
  }
};
