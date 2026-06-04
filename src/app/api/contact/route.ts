import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const OWNER_EMAIL = "vjosue.3004@gmail.com";
const OWNER_WHATSAPP = "50689547758";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, company, email, service, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Faltan campos requeridos." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Email inválido." }, { status: 400 });
    }

    const whatsappText = encodeURIComponent(
      `🔔 *Nuevo lead desde josuesolorzano.com*\n\n` +
      `👤 *Nombre:* ${name}\n` +
      `🏢 *Empresa:* ${company || "No especificada"}\n` +
      `📧 *Email:* ${email}\n` +
      `🎯 *Servicio:* ${service || "No especificado"}\n\n` +
      `💬 *Mensaje:*\n${message}`
    );
    const whatsappUrl = `https://wa.me/${OWNER_WHATSAPP}?text=${whatsappText}`;

    await resend.emails.send({
      from: "Josue Solorzano Web <noreply@josuesolorzano.com>",
      to: OWNER_EMAIL,
      replyTo: email,
      subject: `🔔 Nuevo lead: ${name} — ${service || "Consulta general"}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f4f4f8; margin: 0; padding: 24px;">
          <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
            <div style="background: linear-gradient(135deg, #b8860b, #7a5500); padding: 32px 32px 24px; color: white;">
              <div style="font-size: 28px; margin-bottom: 8px;">🔔</div>
              <h1 style="margin: 0; font-size: 22px; font-weight: 700;">Nuevo mensaje recibido</h1>
              <p style="margin: 6px 0 0; opacity: 0.8; font-size: 14px;">josuesolorzano.com</p>
            </div>
            <div style="padding: 32px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f5; width: 130px;">
                    <span style="font-size: 12px; font-weight: 600; color: #8888aa; text-transform: uppercase; letter-spacing: 0.05em;">Nombre</span>
                  </td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f5;">
                    <span style="color: #111; font-weight: 600;">${name}</span>
                  </td>
                </tr>
                ${company ? `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f5;">
                    <span style="font-size: 12px; font-weight: 600; color: #8888aa; text-transform: uppercase; letter-spacing: 0.05em;">Empresa</span>
                  </td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f5;">
                    <span style="color: #111;">${company}</span>
                  </td>
                </tr>` : ""}
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f5;">
                    <span style="font-size: 12px; font-weight: 600; color: #8888aa; text-transform: uppercase; letter-spacing: 0.05em;">Email</span>
                  </td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f5;">
                    <a href="mailto:${email}" style="color: #b8860b; font-weight: 600; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                ${service ? `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f5;">
                    <span style="font-size: 12px; font-weight: 600; color: #8888aa; text-transform: uppercase; letter-spacing: 0.05em;">Servicio</span>
                  </td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f5;">
                    <span style="background: #b8860b1a; color: #b8860b; font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 20px;">${service}</span>
                  </td>
                </tr>` : ""}
              </table>

              <div style="margin-top: 24px;">
                <div style="font-size: 12px; font-weight: 600; color: #8888aa; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px;">Mensaje</div>
                <div style="background: #f8f8ff; border-left: 3px solid #b8860b; padding: 16px; border-radius: 0 8px 8px 0; color: #333; line-height: 1.6; font-size: 15px;">
                  ${message.replace(/\n/g, "<br>")}
                </div>
              </div>

              <div style="margin-top: 28px; display: flex; gap: 12px;">
                <a href="mailto:${email}?subject=Re: Tu consulta a Josue Solorzano"
                   style="display: inline-block; background: #b8860b; color: white; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 700; font-size: 14px;">
                  ✉️ Responder por email
                </a>
                <a href="${whatsappUrl}" target="_blank"
                   style="display: inline-block; background: #25d366; color: white; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 700; font-size: 14px;">
                  💬 Responder por WhatsApp
                </a>
              </div>
            </div>
            <div style="padding: 16px 32px; background: #f8f8ff; text-align: center; font-size: 12px; color: #8888aa;">
              josuesolorzano.com · Costa Rica · vjosue.3004@gmail.com
            </div>
          </div>
        </body>
        </html>
      `,
    });

    await resend.emails.send({
      from: "Josue Solorzano <noreply@josuesolorzano.com>",
      to: email,
      subject: "Recibí tu mensaje — Josue Solorzano",
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f4f4f8; margin: 0; padding: 24px;">
          <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
            <div style="background: linear-gradient(135deg, #b8860b, #7a5500); padding: 32px; color: white; text-align: center;">
              <div style="width: 56px; height: 56px; background: rgba(255,255,255,0.15); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 800; margin-bottom: 16px;">JS</div>
              <h1 style="margin: 0; font-size: 22px; font-weight: 700;">¡Recibí tu mensaje, ${name.split(" ")[0]}!</h1>
            </div>
            <div style="padding: 32px; color: #333; line-height: 1.7;">
              <p style="margin-top: 0;">Gracias por contactarme. Revisé tu mensaje y te responderé <strong>dentro de las próximas 24 horas hábiles</strong>.</p>
              <p>Si tienes algo urgente que agregar, puedes escribirme directamente por WhatsApp:</p>
              <div style="text-align: center; margin: 24px 0;">
                <a href="https://wa.me/${OWNER_WHATSAPP}" target="_blank"
                   style="display: inline-block; background: #25d366; color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 15px;">
                  💬 WhatsApp directo
                </a>
              </div>
              <p style="margin-bottom: 0; color: #555;">Mientras tanto, puedes leer más sobre cómo trabajo en <a href="https://josuesolorzano.com/sobre-mi" style="color: #b8860b; text-decoration: none; font-weight: 600;">mi historia</a>.</p>
            </div>
            <div style="padding: 16px 32px; background: #f8f8ff; text-align: center; font-size: 12px; color: #8888aa;">
              Josue Solorzano · josuesolorzano.com · Costa Rica
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Error al enviar el mensaje. Intenta de nuevo." }, { status: 500 });
  }
}
