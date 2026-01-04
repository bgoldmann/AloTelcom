// Email template components for order confirmations and notifications
// These templates can be used with email services like SendGrid, Resend, etc.

export interface OrderConfirmationEmail {
  orderId: string;
  customerName: string;
  customerEmail: string;
  planName: string;
  planCountry: string;
  planData: string;
  planValidity: string;
  price: number;
  qrCodeUrl?: string;
  imei?: string;
  deviceModel?: string;
  orderDate: string;
}

export const generateOrderConfirmationHTML = (data: OrderConfirmationEmail): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - AloTelcom</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #EA580C 0%, #F97316 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Order Confirmed!</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Thank you for your purchase</p>
  </div>
  
  <div style="background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${data.customerName},</p>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      Your order has been confirmed! Here are your order details:
    </p>
    
    <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: 600;">Order ID:</td>
          <td style="padding: 8px 0; text-align: right;">${data.orderId}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: 600;">Plan:</td>
          <td style="padding: 8px 0; text-align: right;">${data.planName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: 600;">Country:</td>
          <td style="padding: 8px 0; text-align: right;">${data.planCountry}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: 600;">Data:</td>
          <td style="padding: 8px 0; text-align: right;">${data.planData}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: 600;">Validity:</td>
          <td style="padding: 8px 0; text-align: right;">${data.planValidity}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: 600;">Price:</td>
          <td style="padding: 8px 0; text-align: right; font-size: 20px; color: #EA580C; font-weight: bold;">$${data.price.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: 600;">Order Date:</td>
          <td style="padding: 8px 0; text-align: right;">${new Date(data.orderDate).toLocaleDateString()}</td>
        </tr>
      </table>
    </div>
    
    ${data.qrCodeUrl ? `
    <div style="background: #fff; border: 2px dashed #e5e7eb; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
      <h2 style="margin-top: 0; color: #1C1917;">Your eSIM QR Code</h2>
      <img src="${data.qrCodeUrl}" alt="eSIM QR Code" style="max-width: 300px; margin: 20px auto; display: block; border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px; background: white;">
      <p style="color: #666; font-size: 14px; margin-top: 15px;">
        Scan this QR code with your device to activate your eSIM
      </p>
    </div>
    ` : ''}
    
    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #92400e;">
        <strong>Important:</strong> Your eSIM validity starts when you connect to a supported network. 
        Make sure to install it before your trip!
      </p>
    </div>
    
    <div style="margin: 30px 0;">
      <a href="https://alotelcom.com/help" style="display: inline-block; background: #EA580C; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-right: 10px;">
        Installation Guide
      </a>
      <a href="https://alotelcom.com/dashboard" style="display: inline-block; background: #f3f4f6; color: #1C1917; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600;">
        View Order
      </a>
    </div>
    
    <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px;">
      <p style="font-size: 14px; color: #666; margin: 5px 0;">
        Need help? Contact us at <a href="mailto:support@alotelcom.com" style="color: #EA580C;">support@alotelcom.com</a>
      </p>
      <p style="font-size: 12px; color: #999; margin: 10px 0 0 0;">
        © ${new Date().getFullYear()} AloTelcom. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

export const generateOrderConfirmationText = (data: OrderConfirmationEmail): string => {
  return `
Order Confirmation - AloTelcom

Hi ${data.customerName},

Your order has been confirmed!

Order Details:
- Order ID: ${data.orderId}
- Plan: ${data.planName}
- Country: ${data.planCountry}
- Data: ${data.planData}
- Validity: ${data.planValidity}
- Price: $${data.price.toFixed(2)}
- Order Date: ${new Date(data.orderDate).toLocaleDateString()}

${data.qrCodeUrl ? `Your eSIM QR Code: ${data.qrCodeUrl}\n` : ''}

Installation Guide: https://alotelcom.com/help
View Order: https://alotelcom.com/dashboard

Need help? Contact us at support@alotelcom.com

© ${new Date().getFullYear()} AloTelcom. All rights reserved.
  `.trim();
};

export interface PasswordResetEmail {
  userName: string;
  resetLink: string;
  expiresIn: string;
}

export const generatePasswordResetHTML = (data: PasswordResetEmail): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - AloTelcom</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #EA580C 0%, #F97316 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Reset Your Password</h1>
  </div>
  
  <div style="background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${data.userName},</p>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      We received a request to reset your password. Click the button below to create a new password:
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.resetLink}" style="display: inline-block; background: #EA580C; color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Reset Password
      </a>
    </div>
    
    <p style="font-size: 14px; color: #666; margin: 20px 0;">
      This link will expire in ${data.expiresIn}. If you didn't request this, please ignore this email.
    </p>
    
    <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px;">
      <p style="font-size: 14px; color: #666; margin: 5px 0;">
        Need help? Contact us at <a href="mailto:support@alotelcom.com" style="color: #EA580C;">support@alotelcom.com</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

export interface WelcomeEmail {
  userName: string;
  userEmail: string;
}

export const generateWelcomeHTML = (data: WelcomeEmail): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to AloTelcom</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #EA580C 0%, #F97316 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 32px;">Welcome to AloTelcom!</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 18px;">Your journey to global connectivity starts here</p>
  </div>
  
  <div style="background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${data.userName},</p>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      Welcome to AloTelcom! We're excited to help you stay connected wherever you travel.
    </p>
    
    <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h2 style="margin-top: 0; color: #1C1917;">Get Started:</h2>
      <ul style="list-style: none; padding: 0;">
        <li style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
          <strong>1. Browse Plans</strong><br>
          <span style="color: #666;">Explore eSIM plans for 190+ countries</span>
        </li>
        <li style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
          <strong>2. Choose Your Plan</strong><br>
          <span style="color: #666;">Select the perfect data plan for your destination</span>
        </li>
        <li style="padding: 10px 0;">
          <strong>3. Stay Connected</strong><br>
          <span style="color: #666;">Instant activation, no roaming fees</span>
        </li>
      </ul>
    </div>
    
    <div style="margin: 30px 0;">
      <a href="https://alotelcom.com/marketplace" style="display: inline-block; background: #EA580C; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-right: 10px;">
        Browse Plans
      </a>
      <a href="https://alotelcom.com/help" style="display: inline-block; background: #f3f4f6; color: #1C1917; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600;">
        Learn More
      </a>
    </div>
    
    <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px;">
      <p style="font-size: 14px; color: #666; margin: 5px 0;">
        Questions? Contact us at <a href="mailto:support@alotelcom.com" style="color: #EA580C;">support@alotelcom.com</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

