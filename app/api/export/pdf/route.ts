import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

function wrapText(
  text: string,
  maxWidth: number,
  font: any,
  fontSize: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);
    if (width > maxWidth) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

export async function GET() {
  try {
    const session = await getCurrentSession();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
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
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const margin = 50;
    const pageWidth = 595;
    const pageHeight = 842;
    const contentWidth = pageWidth - margin * 2;

    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;

    // Premium Header
    page.drawRectangle({
      x: 0,
      y: pageHeight - 100,
      width: pageWidth,
      height: 100,
      color: rgb(0.06, 0.09, 0.16), // Dark Slate Gray #111827
    });

    page.drawText("LOOP AI Feedback intelligence", {
      x: margin,
      y: pageHeight - 45,
      size: 20,
      font: bold,
      color: rgb(1, 1, 1),
    });

    page.drawText(`Workspace Feedback Report • ${new Date().toLocaleDateString()}`, {
      x: margin,
      y: pageHeight - 65,
      size: 10,
      font,
      color: rgb(0.6, 0.65, 0.75),
    });

    y = pageHeight - 140;

    // Sub-header summary
    page.drawText("Executive Summary Metrics", {
      x: margin,
      y,
      size: 14,
      font: bold,
      color: rgb(0.06, 0.09, 0.16),
    });

    y -= 25;

    const positive = feedbacks.filter((f) => f.sentiment === "POS").length;
    const neutral = feedbacks.filter((f) => f.sentiment === "NEU").length;
    const negative = feedbacks.filter((f) => f.sentiment === "NEG").length;

    page.drawText(`Total Feedback: ${feedbacks.length}  |  Positive: ${positive}  |  Neutral: ${neutral}  |  Negative: ${negative}`, {
      x: margin,
      y,
      size: 11,
      font: bold,
      color: rgb(0.3, 0.4, 0.5),
    });

    y -= 35;

    feedbacks.forEach((feedback, index) => {
      // Calculate estimated space needed for this item
      const contentLines = wrapText(feedback.content, contentWidth - 20, font, 10);
      const neededHeight = 45 + contentLines.length * 14;

      // Add page break if we are out of height
      if (y - neededHeight < margin) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin - 30;
      }

      // Draw light gray background border card
      page.drawRectangle({
        x: margin,
        y: y - neededHeight + 10,
        width: contentWidth,
        height: neededHeight - 10,
        borderColor: rgb(0.9, 0.92, 0.95),
        borderWidth: 1,
        color: rgb(0.98, 0.98, 0.99),
      });

      // Item title index
      page.drawText(`Feedback #${index + 1}`, {
        x: margin + 15,
        y: y - 20,
        size: 10,
        font: bold,
        color: rgb(0.12, 0.16, 0.22),
      });

      // Status pill mock
      const statusText = `[${feedback.channel}] • ${feedback.sentiment || "UNANALYZED"}`;
      page.drawText(statusText, {
        x: pageWidth - margin - 15 - font.widthOfTextAtSize(statusText, 8),
        y: y - 20,
        size: 8,
        font: bold,
        color:
          feedback.sentiment === "POS"
            ? rgb(0.05, 0.5, 0.3) // Green
            : feedback.sentiment === "NEG"
            ? rgb(0.8, 0.1, 0.2) // Red
            : rgb(0.4, 0.4, 0.45),
      });

      let lineY = y - 35;
      contentLines.forEach((line) => {
        page.drawText(line, {
          x: margin + 15,
          y: lineY,
          size: 10,
          font,
          color: rgb(0.2, 0.23, 0.28),
        });
        lineY -= 14;
      });

      y -= neededHeight + 10;
    });

    const pdfBytes = await pdfDoc.save();

    const arrayBuffer = pdfBytes.buffer.slice(
      pdfBytes.byteOffset,
      pdfBytes.byteOffset + pdfBytes.byteLength
    ) as ArrayBuffer;

    return new Response(arrayBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="feedback-report.pdf"',
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to export PDF." },
      { status: 500 }
    );
  }
}