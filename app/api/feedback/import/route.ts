import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { createFeedback } from "@/services/feedback.service";
import { createFeedbackSchema } from "@/schemas/feedback.schema";
import Papa from "papaparse";

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();

    if (!session?.user || session.user.role === "VIEWER") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No CSV file provided." },
        { status: 400 }
      );
    }

    const text = await file.text();

    const parsed = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    });

    if (parsed.errors.length > 0) {
      return NextResponse.json(
        { success: false, message: "Failed to parse CSV file." },
        { status: 400 }
      );
    }

    const rows = parsed.data as any[];
    let successCount = 0;
    let failedCount = 0;

    for (const row of rows) {
      const payload = {
        content: row.content || "",
        channel: row.channel || "CSV Import",
        sourceRef: row.sourceRef || "",
        customerLabel: row.customerLabel || "",
      };

      const validation = createFeedbackSchema.safeParse(payload);

      if (!validation.success) {
        failedCount++;
        continue;
      }

      try {
        await createFeedback(validation.data, session.user.workspaceId);
        successCount++;
      } catch (error) {
        failedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Import complete. ${successCount} imported, ${failedCount} failed.`,
      totalImported: successCount,
      failedRows: failedCount,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
