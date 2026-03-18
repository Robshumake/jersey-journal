import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(params: EmailParams) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'publisher@thejerseyjournal.news',
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
    return info;
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
}

export function generatePaymentConfirmationEmail(params: {
  recipientName: string;
  recipientEmail: string;
  type: 'legal-notice' | 'obituary' | 'feature' | 'subscription';
  amount: number;
  reference: string;
}) {
  const typeLabels = {
    'legal-notice': 'Legal Notice Publication',
    'obituary': 'Obituary Publication',
    'feature': '"You\'ve Been Selected" Feature',
    'subscription': 'Digital Edition Subscription',
  };

  const html = `
    <div style="font-family: 'Source Sans Pro', sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #003087; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-family: 'Playfair Display', serif;">The Jersey Journal</h1>
        <p style="margin: 5px 0 0 0; font-size: 14px;">Hudson County's Voice Since 1867</p>
      </div>
      
      <div style="padding: 30px; background-color: #F5F5F5;">
        <h2 style="color: #003087; font-family: 'Playfair Display', serif;">Payment Confirmation</h2>
        
        <p>Dear ${params.recipientName},</p>
        
        <p>Thank you for your submission to <strong>The Jersey Journal</strong>. We've received your payment and your submission is now in our queue for processing.</p>
        
        <div style="background-color: white; padding: 20px; border-left: 4px solid #C9A84C; margin: 20px 0;">
          <p style="margin: 0 0 10px 0;"><strong>Service:</strong> ${typeLabels[params.type]}</p>
          <p style="margin: 0 0 10px 0;"><strong>Amount:</strong> $${(params.amount / 100).toFixed(2)}</p>
          <p style="margin: 0;"><strong>Reference:</strong> ${params.reference}</p>
        </div>
        
        <p><strong>What happens next:</strong></p>
        <ul>
          <li>Our team will review your submission within 2 hours during business hours</li>
          <li>You'll receive a follow-up email with publication details</li>
          <li>For legal notices, we'll generate your affidavit PDF</li>
          <li>Publication will be coordinated with you</li>
        </ul>
        
        <p>If you have any questions, please contact us at <a href="mailto:publisher@thejerseyjournal.news">publisher@thejerseyjournal.news</a> or call during business hours.</p>
        
        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
          The Jersey Journal | Publisher's Office<br/>
          publisher@thejerseyjournal.news<br/>
          Hudson County, NJ
        </p>
      </div>
    </div>
  `;

  return {
    to: params.recipientEmail,
    subject: `Payment Confirmation - ${typeLabels[params.type]}`,
    html,
  };
}

export function generateAffidavitEmail(params: {
  recipientName: string;
  recipientEmail: string;
  businessName: string;
  affidavitUrl: string;
}) {
  const html = `
    <div style="font-family: 'Source Sans Pro', sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #003087; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-family: 'Playfair Display', serif;">The Jersey Journal</h1>
        <p style="margin: 5px 0 0 0; font-size: 14px;">Hudson County's Voice Since 1867</p>
      </div>
      
      <div style="padding: 30px; background-color: #F5F5F5;">
        <h2 style="color: #003087; font-family: 'Playfair Display', serif;">Your Affidavit of Publication</h2>
        
        <p>Dear ${params.recipientName},</p>
        
        <p>Your legal notice for <strong>${params.businessName}</strong> has been published in The Jersey Journal. Your affidavit of publication is ready to download.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${params.affidavitUrl}" style="background-color: #C9A84C; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
            Download Affidavit PDF
          </a>
        </div>
        
        <p>This document certifies that your legal notice was published and can be used for court filings or regulatory compliance.</p>
        
        <p>If you need any additional copies or have questions, please contact us at <a href="mailto:publisher@thejerseyjournal.news">publisher@thejerseyjournal.news</a>.</p>
        
        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
          The Jersey Journal | Publisher's Office<br/>
          publisher@thejerseyjournal.news<br/>
          Hudson County, NJ
        </p>
      </div>
    </div>
  `;

  return {
    to: params.recipientEmail,
    subject: 'Your Affidavit of Publication',
    html,
  };
}
