import { NextResponse } from 'next/server';
import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;

  // Load template image from public folder
  const templatePath = path.join(process.cwd(), 'public', 'doctor_pre.png');
  const templateImageBytes = fs.readFileSync(templatePath);

  // Create PDF
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size

  // Embed image
  const image = await pdfDoc.embedPng(templateImageBytes);
  page.drawImage(image, {
    x: 0,
    y: 0,
    width: 595,
    height: 842, 
  });

  // TODO: Fetch real data from DB/localStorage equivalent on server
  const doctorName = 'Dr. John Smith';
  const speciality = 'Cardiologist';
  const patientName = 'John Doe';
  const medicines = 'Paracetamol, Ibuprofen';
  const dosage = '2 times a day';
  const duration = '5 days';
  const notes = 'Take after food';

  page.drawText(`Doctor: ${doctorName}`, { x: 50, y: 720, size: 12, color: rgb(0, 0, 0) });
  page.drawText(`Speciality: ${speciality}`, { x: 50, y: 705, size: 12 });
  page.drawText(`Patient: ${patientName}`, { x: 50, y: 690, size: 12 });
  page.drawText(`Medicines: ${medicines}`, { x: 50, y: 500, size: 12 });
  page.drawText(`Dosage: ${dosage}`, { x: 50, y: 485, size: 12 });
  page.drawText(`Duration: ${duration}`, { x: 50, y: 470, size: 12 });
  page.drawText(`Notes: ${notes}`, { x: 50, y: 455, size: 12 });

  const pdfBytes = await pdfDoc.save();

  return new NextResponse(pdfBytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=prescription-${id}.pdf`,
    },
  });
}
