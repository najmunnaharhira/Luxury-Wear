import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const statusMessages: Record<string, { subject: string; heading: string; body: string }> = {
  processing: {
    subject: "Your order is being processed",
    heading: "Order Processing",
    body: "We're preparing your order. You'll receive another update once it ships.",
  },
  shipped: {
    subject: "Your order has shipped!",
    heading: "Order Shipped",
    body: "Great news! Your order is on its way. Keep an eye out for delivery.",
  },
  delivered: {
    subject: "Your order has been delivered",
    heading: "Order Delivered",
    body: "Your order has been delivered. We hope you love your new items!",
  },
  cancelled: {
    subject: "Your order has been cancelled",
    heading: "Order Cancelled",
    body: "Your order has been cancelled. If you have questions, please reach out to our support team.",
  },
  pending: {
    subject: "Your order status update",
    heading: "Order Pending",
    body: "Your order is pending. We'll update you as it progresses.",
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminId = claimsData.claims.sub;

    // Verify admin role
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: adminId,
      _role: "admin",
    });

    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { orderId, newStatus } = await req.json();

    if (!orderId || !newStatus) {
      return new Response(JSON.stringify({ error: "Missing orderId or newStatus" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get order with user info
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: order, error: orderError } = await serviceClient
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get user email
    const { data: userData, error: userError } = await serviceClient.auth.admin.getUserById(
      order.user_id
    );

    if (userError || !userData?.user?.email) {
      return new Response(JSON.stringify({ error: "User email not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const email = userData.user.email;
    const statusInfo = statusMessages[newStatus] || statusMessages.pending;

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
        <tr><td style="background:#18181b;padding:32px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:24px;">${statusInfo.heading}</h1>
        </td></tr>
        <tr><td style="padding:32px;">
          <p style="color:#3f3f46;font-size:16px;line-height:1.6;margin:0 0 16px;">
            ${statusInfo.body}
          </p>
          <table width="100%" style="background:#f4f4f5;border-radius:8px;padding:16px;margin:16px 0;" cellpadding="8">
            <tr>
              <td style="color:#71717a;font-size:13px;">Order ID</td>
              <td style="color:#18181b;font-size:13px;font-weight:600;text-align:right;">${orderId.slice(0, 8)}...</td>
            </tr>
            <tr>
              <td style="color:#71717a;font-size:13px;">Status</td>
              <td style="color:#18181b;font-size:13px;font-weight:600;text-align:right;text-transform:capitalize;">${newStatus}</td>
            </tr>
            <tr>
              <td style="color:#71717a;font-size:13px;">Total</td>
              <td style="color:#18181b;font-size:13px;font-weight:600;text-align:right;">${order.total}</td>
            </tr>
          </table>
          <p style="color:#a1a1aa;font-size:13px;margin:24px 0 0;text-align:center;">
            Thank you for shopping with us.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Order Updates <onboarding@resend.dev>",
        to: [email],
        subject: statusInfo.subject,
        html: emailHtml,
      }),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error("Resend error:", resendData);
      return new Response(JSON.stringify({ error: "Failed to send email", details: resendData }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, emailId: resendData.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
