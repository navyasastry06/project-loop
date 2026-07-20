import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { generateVoiceOfCustomer } from "@/services/voc.service";

export async function GET() {
  try {
    const session = await getCurrentSession();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const report = await generateVoiceOfCustomer(
      session.user.workspaceId
    );

    return NextResponse.json({
      success: true,
      ...report,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate Voice of Customer report.",
      },
      { status: 500 }
    );
  }
}
