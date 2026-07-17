import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-check";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const [totalUsers, totalCards, totalScans, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.card.count(),
      prisma.card.aggregate({
        _sum: { scans: true },
      }),
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      }),
    ]);

    const stats = {
      totalUsers,
      totalCards,
      totalScans: totalScans._sum.scans || 0,
      recentUsers,
      timestamp: new Date(),
    };

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}
