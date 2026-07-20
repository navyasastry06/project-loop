import { NextResponse } from "next/server";
import { Parser } from "json2csv";

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

        const parser = new Parser();

        const csv = parser.parse(feedbacks);

        return new Response(csv, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition":
                    'attachment; filename="feedback-report.csv"',
            },
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to export CSV.",
            },
            {
                status: 500,
            }
        );
    }
}