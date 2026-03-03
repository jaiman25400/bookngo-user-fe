import { NextResponse } from "next/server";

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "business.bookngo@gmail.com";
const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // If Resend API key is set, send email via Resend (https://resend.com)
    if (RESEND_API_KEY) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Book N Go Contact <onboarding@resend.dev>",
          to: [CONTACT_EMAIL],
          replyTo: email,
          subject: `Contact from ${name} (Book N Go)`,
          text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
          html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, "<br>")}</p>`,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Resend error:", err);
        return NextResponse.json(
          { error: "Failed to send email. Please try again." },
          { status: 502 }
        );
      }
    } else {
      // No Resend key: log so you can see submissions (e.g. in server logs / Vercel logs)
      console.log("[Contact form submission]", { name, email, message });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Contact API error:", e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
