import { serve } from "https://deno.land/std@0.220.1/http/server.ts";
import {
  encodeBase64 as base64Encode,
  decodeBase64 as base64Decode,
} from "https://deno.land/std@0.220.1/encoding/base64.ts";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ServiceAccount {
  project_id: string;
  client_email: string;
  private_key_id: string;
  private_key: string;
}

// Load service account credentials from Supabase secrets
let serviceAccount: ServiceAccount;
try {
  const serviceAccountText = Deno.env.get("FIREBASE_SERVICE_ACCOUNT");
  if (!serviceAccountText) {
    console.error("CRITICAL: FIREBASE_SERVICE_ACCOUNT is not set");
    throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable is not set");
  }
  try {
    serviceAccount = JSON.parse(serviceAccountText);
    console.error("CRITICAL: Service Account Loaded Successfully:", {
      project_id: serviceAccount.project_id,
      client_email: serviceAccount.client_email,
      private_key_id: serviceAccount.private_key_id,
      has_private_key: !!serviceAccount.private_key,
      private_key_length: serviceAccount.private_key?.length || 0,
    });
  } catch (parseError) {
    console.error(
      "CRITICAL: Failed to parse service account JSON:",
      parseError
    );
    throw parseError;
  }
} catch (error) {
  console.error("CRITICAL: Failed to load service account:", error);
  throw error;
}
// Function to create JWT token
async function createJWT() {
  try {
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: serviceAccount.client_email,
      sub: serviceAccount.client_email,
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
      scope: "https://www.googleapis.com/auth/firebase.messaging",
    };
    const header = {
      alg: "RS256",
      typ: "JWT",
      kid: serviceAccount.private_key_id,
    };
    console.error("CRITICAL: JWT Creation Started", {
      header,
      payload,
      private_key_length: serviceAccount.private_key.length,
    });
    const encodedHeader = base64Encode(JSON.stringify(header));
    const encodedPayload = base64Encode(JSON.stringify(payload));
    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    console.error("CRITICAL: JWT Signature Input Created");
    try {
      // Convert the private key to the correct format
      const privateKeyPem = serviceAccount.private_key
        .replace(/\\n/g, "\n")
        .replace(/-----BEGIN PRIVATE KEY-----/, "-----BEGIN PRIVATE KEY-----\n")
        .replace(/-----END PRIVATE KEY-----/, "\n-----END PRIVATE KEY-----")
        .trim();
      console.error("CRITICAL: Private Key Formatted", {
        hasBeginMarker: privateKeyPem.includes("-----BEGIN PRIVATE KEY-----"),
        hasEndMarker: privateKeyPem.includes("-----END PRIVATE KEY-----"),
        lineCount: privateKeyPem.split("\n").length,
      });
      // Convert PEM to DER format
      const pemContents = privateKeyPem
        .replace(/-----BEGIN PRIVATE KEY-----/, "")
        .replace(/-----END PRIVATE KEY-----/, "")
        .replace(/\n/g, "")
        .replace(/\r/g, "")
        .replace(/\t/g, "")
        .replace(/\s/g, "")
        .replace(/\s+/g, "")
        .replace(/\n/g, "")
        .replace(/\r/g, "")
        .trim();
      const binaryDer = base64Decode(pemContents);
      console.error("CRITICAL: PEM Converted to DER");
      // Import the key as DER
      const key = await crypto.subtle.importKey(
        "pkcs8",
        binaryDer,
        {
          name: "RSASSA-PKCS1-v1_5",
          hash: "SHA-256",
        },
        false,
        ["sign"]
      );
      console.error("CRITICAL: Private Key Imported Successfully");
      const signature = await crypto.subtle.sign(
        {
          name: "RSASSA-PKCS1-v1_5",
          hash: "SHA-256",
        },
        key,
        new TextEncoder().encode(signatureInput)
      );
      console.error("CRITICAL: Signature Created Successfully");
      const jwt = `${signatureInput}.${base64Encode(signature)}`;
      console.error("CRITICAL: JWT Generated Successfully");
      return jwt;
    } catch (cryptoError) {
      console.error("CRITICAL: Crypto Operation Failed:", {
        error: cryptoError,
        message:
          cryptoError instanceof Error ? cryptoError.message : "Unknown error",
        stack: cryptoError instanceof Error ? cryptoError.stack : undefined,
      });
      throw cryptoError;
    }
  } catch (error) {
    console.error("CRITICAL: JWT Creation Error:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}
serve(async (req) => {
  console.log("[REQUEST] Method:", req.method);
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }
  try {
    // Log the raw request body for debugging
    const rawBody = await req.text();
    console.error("CRITICAL: Raw request body:", rawBody);
    // Parse the JSON body
    const { token, tokens, notification, data } = JSON.parse(rawBody);
    // Log the parsed request data
    console.error("CRITICAL: Parsed request data:", {
      hasToken: !!token,
      hasTokens: !!tokens,
      notification,
      data,
    });
    // Convert single token to array if needed
    const tokenArray = tokens || (token ? [token] : []);
    // Log the actual request
    console.error("CRITICAL: Notification Request", {
      tokens: tokenArray.map((t: string) => t?.substring(0, 20) + "..."),
      notification,
      data,
    });
    if (!tokenArray || tokenArray.length === 0) {
      console.error("[ERROR] Missing or invalid FCM tokens");
      return new Response(
        JSON.stringify({
          error: "FCM token is required",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
    if (!notification || !notification.title || !notification.body) {
      console.error("[ERROR] Missing notification details:", {
        notification,
      });
      return new Response(
        JSON.stringify({
          error: "Notification title and body are required",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
    // Get access token
    const jwt = await createJWT();
    console.error("CRITICAL: JWT Created:", jwt);
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    });
    const tokenData = await tokenResponse.json();
    console.error("CRITICAL: Token Response:", tokenData);
    if (!tokenData.access_token) {
      console.error("CRITICAL: Failed to get access token");
      return new Response(
        JSON.stringify({
          error: "Failed to authenticate with Firebase",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
    // Process notifications for all tokens
    const results = await Promise.all(
      tokenArray.map(async (token: string) => {
        try {
          // Construct the FCM message with v1 API format
          const message = {
            message: {
              token: token,
              notification: {
                title: notification.title,
                body: notification.body,
              },
              data: {
                ...data,
                type: data?.type || "default",
                timestamp: new Date().toISOString(),
              },
              android: {
                notification: {
                  sound: "default",
                  click_action: "FLUTTER_NOTIFICATION_CLICK",
                },
                priority: "high",
              },
              apns: {
                payload: {
                  aps: {
                    sound: "default",
                    badge: 1,
                  },
                },
              },
            },
          };
          // Log the actual FCM request
          console.error("CRITICAL: FCM Request", {
            url: `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenData.access_token}`,
            },
            body: JSON.stringify(message, null, 2),
          });
          const response = await fetch(
            `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenData.access_token}`,
              },
              body: JSON.stringify(message),
            }
          );
          const responseText = await response.text();
          console.error("CRITICAL: Raw FCM Response:", responseText);
          let responseData;
          try {
            responseData = JSON.parse(responseText);
          } catch (e) {
            console.error("CRITICAL: Failed to parse FCM response as JSON:", e);
            responseData = {
              error: responseText,
            };
          }
          // Log the actual FCM response
          console.error("CRITICAL: FCM Response", {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            body: responseData,
          });
          return {
            token,
            success: response.ok,
            messageId: responseData.name,
            error: responseData.error?.message || null,
            details: responseData,
          };
        } catch (error) {
          console.error("CRITICAL: Token Processing Error", {
            token: token.substring(0, 20) + "...",
            error: error instanceof Error ? error.message : "Unknown error",
          });
          return {
            token,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      })
    );
    // Calculate overall success/failure
    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.length - successCount;
    console.log("[FCM] Notification Results:", {
      total: results.length,
      success: successCount,
      failure: failureCount,
      results,
    });
    return new Response(
      JSON.stringify({
        success: failureCount === 0,
        total: results.length,
        successCount,
        failureCount,
        results,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: failureCount === 0 ? 200 : 207,
      }
    );
  } catch (error) {
    console.error("CRITICAL: Unexpected Error", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return new Response(
      JSON.stringify({
        error: `Failed to send notification: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
