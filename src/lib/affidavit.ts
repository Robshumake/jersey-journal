import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

export interface AffidavitParams {
  businessName: string;
  businessAddress: string;
  noticeText: string;
  publicationDate: Date;
  issueNumber: string;
  volumeNumber: string;
}

export async function generateAffidavitPDF(params: AffidavitParams): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'LETTER',
        margin: 72, // 1 inch margins
      });

      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => {
        chunks.push(chunk);
      });

      doc.on('end', () => {
        resolve(Buffer.concat(chunks));
      });

      doc.on('error', reject);

      // Header with Jersey Journal masthead
      doc
        .font('Helvetica-Bold', 16)
        .text('THE JERSEY JOURNAL', { align: 'center' })
        .fontSize(12)
        .text('Hudson County\'s Voice Since 1867', { align: 'center' })
        .fontSize(10)
        .text('A Newspaper of General Circulation', { align: 'center' });

      // Affidavit title
      doc
        .moveTo(72, doc.y + 10)
        .lineTo(522, doc.y + 10)
        .stroke();

      doc
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('AFFIDAVIT OF PUBLICATION', { align: 'center' })
        .fontSize(11)
        .font('Helvetica');

      // State and County
      doc.text('STATE OF NEW JERSEY', { align: 'center' });
      doc.text('COUNTY OF HUDSON', { align: 'center' });

      // Main affidavit text
      doc.fontSize(10).text(
        'I, the undersigned, being duly sworn and according to law, depose and say that I am the Publisher of The Jersey Journal, ' +
        'a newspaper of general circulation published in Hudson County, New Jersey, and that the same is duly entered and recorded ' +
        'as a newspaper in the office of the Secretary of State of New Jersey in accordance with the requirements of the law.',
        {
          align: 'justify',
          width: 468,
        }
      );

      doc.text('', 0); // Add spacing

      doc.text(
        'I further certify that the following notice/advertisement was published in The Jersey Journal as follows:',
        {
          align: 'justify',
          width: 468,
        }
      );

      // Notice details box
      doc
        .rect(72, doc.y + 10, 468, 140)
        .stroke();

      doc
        .fontSize(9)
        .text('Business Name: ' + params.businessName, 80, doc.y + 15)
        .text('Business Address: ' + params.businessAddress)
        .text('Publication Issue: Volume ' + params.volumeNumber + ', Issue ' + params.issueNumber)
        .text('Publication Date: ' + params.publicationDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }));

      doc.y += 155;

      // Notice text
      doc
        .fontSize(9)
        .font('Helvetica-Bold')
        .text('NOTICE TEXT:', 80)
        .font('Helvetica');

      doc.fontSize(8).text(params.noticeText, {
        align: 'left',
        width: 430,
      });

      // Signature area
      doc
        .moveTo(72, doc.y + 20)
        .lineTo(250, doc.y + 20)
        .stroke();

      doc
        .fontSize(10)
        .text('Publisher Signature', 72, doc.y + 5);

      doc.text('Date: ' + new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }), 350, doc.y - 5);

      // Notary section
      doc
        .fontSize(11)
        .font('Helvetica-Bold')
        .text('NOTARY PUBLIC', { align: 'center' })
        .fontSize(10)
        .font('Helvetica');

      doc
        .moveTo(72, doc.y + 10)
        .lineTo(250, doc.y + 10)
        .stroke();

      doc
        .fontSize(9)
        .text('Notary Public Signature', 72, doc.y + 5);

      doc
        .moveDown()
        .fontSize(9)
        .text('My Commission Expires: _______________', 72);

      // NJ Qualification Statement
      doc
        .moveDown()
        .fontSize(8)
        .font('Helvetica-Bold')
        .text('NJ NEWSPAPER QUALIFICATION:', { align: 'center' })
        .font('Helvetica')
        .fontSize(7)
        .text(
          'The Jersey Journal is a newspaper of general circulation qualified under New Jersey law. ' +
          'This publication is entered in the office of the Secretary of State and meets all requirements for publishing legal notices.',
          {
            align: 'center',
            width: 468,
          }
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
