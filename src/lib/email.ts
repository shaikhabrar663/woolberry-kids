import nodemailer from 'nodemailer';

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  address?: string;
  city?: string;
  pincode?: string;
  items: string;
  totalAmount: number;
  paymentMethod: string;
  status?: string;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL || '',
    pass: process.env.SMTP_PASSWORD || '',
  },
});

export async function sendOrderConfirmationEmail(order: OrderEmailData) {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    return { success: false, reason: 'SMTP not configured' };
  }

  const recipient = order.customerEmail || process.env.STORE_ADMIN_EMAIL || process.env.SMTP_EMAIL;

  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #FFFDF9; padding: 30px 15px; color: #2D221C; line-height: 1.6;">
      <table align="center" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; border: 1px solid #F4EBE1; overflow: hidden; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
        <tr>
          <td align="center" style="padding-bottom: 20px; border-bottom: 1px solid #F4EBE1;">
            <h1 style="color: #2D221C; font-size: 24px; font-weight: 800; margin: 0; text-transform: uppercase;">Woolberry Kids</h1>
            <p style="color: #8C7B71; font-size: 11px; font-weight: 700; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">Handcrafted With Love For Little Ones</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 24px 0 16px 0;">
            <h2 style="font-size: 18px; font-weight: 700; margin: 0 0 8px 0; color: #2D221C;">Thank You For Your Order!</h2>
            <p style="font-size: 13px; color: #5C4D44; margin: 0;">Hi <strong>${order.customerName}</strong>, we have received your order and our master artisans are preparing your package for dispatch.</p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #FAF5EE; border-radius: 12px; padding: 16px;">
            <table width="100%" style="font-size: 12px; color: #5C4D44;">
              <tr>
                <td style="padding-bottom: 6px;"><strong>Order ID:</strong></td>
                <td align="right" style="padding-bottom: 6px; font-family: monospace; font-weight: 700; color: #2D221C;">${order.orderNumber}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 6px;"><strong>Payment Method:</strong></td>
                <td align="right" style="padding-bottom: 6px; font-weight: 700; color: #E11D48;">${order.paymentMethod}</td>
              </tr>
              <tr>
                <td style="border-top: 1px solid #EBE2D5; padding-top: 8px;"><strong>Total Amount:</strong></td>
                <td align="right" style="border-top: 1px solid #EBE2D5; padding-top: 8px; font-size: 16px; font-weight: 800; color: #2D221C;">Rs. ${Number(order.totalAmount).toLocaleString('en-IN')}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px 0 10px 0;">
            <h3 style="font-size: 13px; font-weight: 700; text-transform: uppercase; color: #8C7B71; margin: 0 0 8px 0;">Package Summary</h3>
            <p style="font-size: 13px; color: #2D221C; margin: 0; background: #FFFDF9; border: 1px solid #F4EBE1; padding: 12px; border-radius: 8px;">${order.items}</p>
          </td>
        </tr>
        <tr>
          <td style="padding-top: 24px; border-top: 1px solid #F4EBE1; text-align: center;">
            <p style="font-size: 11px; color: #8C7B71; margin: 0;">Support: <a href="mailto:support@woolberrykids.com" style="color: #E11D48; text-decoration: none;">support@woolberrykids.com</a></p>
          </td>
        </tr>
      </table>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Woolberry Kids" <${process.env.SMTP_EMAIL}>`,
      to: recipient,
      subject: `Order Confirmed: ${order.orderNumber} - Woolberry Kids`,
      html: htmlContent,
    });
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Failed to send order email:', error);
    return { success: false, error: error.message };
  }
}

export async function sendDispatchStatusEmail(order: OrderEmailData) {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    return { success: false, reason: 'SMTP not configured' };
  }

  const recipient = order.customerEmail || process.env.STORE_ADMIN_EMAIL || process.env.SMTP_EMAIL;

  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #FFFDF9; padding: 30px 15px; color: #2D221C; line-height: 1.6;">
      <table align="center" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; border: 1px solid #F4EBE1; overflow: hidden; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
        <tr>
          <td align="center" style="padding-bottom: 20px; border-bottom: 1px solid #F4EBE1;">
            <h1 style="color: #2D221C; font-size: 24px; font-weight: 800; margin: 0; text-transform: uppercase;">Woolberry Kids</h1>
            <p style="color: #8C7B71; font-size: 11px; font-weight: 700; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">Handcrafted With Love For Little Ones</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 24px 0 16px 0;">
            <h2 style="font-size: 18px; font-weight: 700; margin: 0 0 8px 0; color: #0284C7;">Your Parcel Has Been Dispatched! ??</h2>
            <p style="font-size: 13px; color: #5C4D44; margin: 0;">Hi <strong>${order.customerName}</strong>, your handcrafted baby knitwear package has been handed over to our courier partner and is on its way to you.</p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #F0F9FF; border: 1px solid #BAE6FD; border-radius: 12px; padding: 16px;">
            <table width="100%" style="font-size: 12px; color: #0369A1;">
              <tr>
                <td style="padding-bottom: 6px;"><strong>Tracking / Order ID:</strong></td>
                <td align="right" style="padding-bottom: 6px; font-family: monospace; font-weight: 700; color: #0C4A6E;">${order.orderNumber}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 6px;"><strong>Delivery City:</strong></td>
                <td align="right" style="padding-bottom: 6px; font-weight: 700;">${order.city || 'India'}</td>
              </tr>
              <tr>
                <td style="border-top: 1px solid #BAE6FD; padding-top: 8px;"><strong>Status:</strong></td>
                <td align="right" style="border-top: 1px solid #BAE6FD; padding-top: 8px; font-weight: 800; color: #0284C7;">In Transit (Express Shipping)</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding-top: 24px; border-top: 1px solid #F4EBE1; text-align: center;">
            <p style="font-size: 11px; color: #8C7B71; margin: 0;">Track your parcel anytime at <a href="https://woolberrykids.com/track-order" style="color: #E11D48; text-decoration: none; font-weight: 700;">woolberrykids.com/track-order</a></p>
          </td>
        </tr>
      </table>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Woolberry Kids Dispatch" <${process.env.SMTP_EMAIL}>`,
      to: recipient,
      subject: `Package Dispatched: ${order.orderNumber} - Woolberry Kids`,
      html: htmlContent,
    });
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Failed to send dispatch email:', error);
    return { success: false, error: error.message };
  }
}
