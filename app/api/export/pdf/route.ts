import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getCurrentSession();

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const feedbacks = await prisma.feedback.findMany({
      where: {
        workspaceId: session.user.workspaceId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const pdfDoc = await PDFDocument.create();

    const page = pdfDoc.addPage([595, 842]); // A4

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let y = 800;

    page.drawText("LOOP AI Feedback Report", {
      x: 50,
      y,
      size: 22,
      font: bold,
      color: rgb(0, 0, 0),
    });

    y -= 35;

    page.drawText(`Generated: ${new Date().toLocaleString()}`, {
      x: 50,
      y,
      size: 10,
      font,
    });

    y -= 25;

    page.drawText(`Total Feedback: ${feedbacks.length}`, {
      x: 50,
      y,
      size: 14,
      font: bold,
    });

    y -= 35;

    feedbacks.forEach((feedback, index) => {
      if (y < 80) return;

      page.drawText(`${index + 1}. ${feedback.content}`, {
        x: 50,
        y,
        size: 11,
        font: bold,
      });

      y -= 18;

      page.drawText(`Channel: ${feedback.channel}`, {
        x: 70,
        y,
        size: 10,
        font,
      });

      y -= 15;

      page.drawText(`Sentiment: ${feedback.sentiment ?? "-"}`, {
        x: 70,
        y,
        size: 10,
        font,
      });

      y -= 15;

      page.drawText(`Category: ${feedback.category ?? "-"}`, {
        x: 70,
        y,
        size: 10,
        font,
      });

      y -= 15;

      page.drawText(`Status: ${feedback.status}`, {
        x: 70,
        y,
        size: 10,
        font,
      });

      y -= 25;
    });

    const pdfBytes = await pdfDoc.save();

const arrayBuffer = pdfBytes.buffer.slice(
  pdfBytes.byteOffset,
  pdfBytes.byteOffset + pdfBytes.byteLength
) as ArrayBuffer;

return new Response(arrayBuffer, {
  headers: {
    "Content-Type": "application/pdf",
    "Content-Disposition":
      'attachment; filename="feedback-report.pdf"',
  },
});
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to export PDF.",
      },
      {
        status: 500,
      }
    );
  }
}