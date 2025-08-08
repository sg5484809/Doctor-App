import { NextResponse, type NextRequest } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

interface RouteParams {
  id: string;
}

async function getData(id: string) {
  const prescriptions = JSON.parse(
    '[{"id":"1","patientId":"101","medicines":["Paracetamol"],"dosage":"500mg","duration":"5 days","notes":"Take after meals"}]'
  );
  const patients = JSON.parse(
    '[{"id":"101","name":"Riya Sharma","appointmentDate":"2025/08/06","age":"29","sex":"Female","weight":"58kg","diagnosis":"Flu"}]'
  );

  const prescription = prescriptions.find((p: any) => p.id === id);
  if (!prescription) return null;

  const patient = patients.find((a: any) => a.id === prescription.patientId);
  if (!patient) return null;

  return { prescription, patient };
}

export async function GET(req: NextRequest, context: any) {
  const { params } = context as { params: RouteParams };
  const { id } = params;

  const data = await getData(id);
  if (!data) {
    return NextResponse.json(
      { error: "Prescription not found" },
      { status: 404 }
    );
  }

  const { prescription, patient } = data;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([800, 1100]);
  const { height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const drawText = (text: string, x: number, y: number, size = 14) => {
    page.drawText(text, {
      x,
      y,
      size,
      font,
      color: rgb(0, 0, 0),
    });
  };

  drawText("Dr. Andrew Staton", 205, height - 65, 20);
  drawText("MBBS, MD (Cardiology)", 205, height - 95, 14);

  drawText(`Patient Name: ${patient.name}`, 140, height - 225, 16);
  drawText(`Date: ${patient.appointmentDate}`, 600, height - 225, 16);
  drawText(`Age: ${patient.age || "N/A"}`, 70, height - 285, 16);
  drawText(`Gender: ${patient.sex || "N/A"}`, 300, height - 285, 16);
  drawText(`Weight: ${patient.weight || "N/A"}`, 600, height - 285, 16);

  let yPosition = height - 350;
  prescription.medicines.forEach((med: string) => {
    drawText(
      `${med} — ${prescription.dosage} — ${prescription.duration}`,
      100,
      yPosition,
      16
    );
    yPosition -= 25;
  });

  if (prescription.notes) {
    drawText(prescription.notes, 100, yPosition - 10, 14);
  }

  const pdfBytes = await pdfDoc.save();

  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=prescription-${id}.pdf`,
    },
  });
}
