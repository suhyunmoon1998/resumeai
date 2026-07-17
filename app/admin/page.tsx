"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type TabType = "stats" | "users" | "cards";

interface Stats {
  totalUsers: number;
  totalCards: number;
  totalScans: number;
  recentUsers: Array<{
    id: string;
    name: string | null;
    email: string | null;
    createdAt: string;
  }>;
}

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: string;
  _count: { cards: number };
}

interface Card {
  id: string;
  shareSlug: string;
  scans: number;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("stats");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === "stats") {
          const res = await fetch("/api/admin/stats");
          if (res.ok) {
            const data = await res.json();
            setStats(data);
          }
        } else if (activeTab === "users") {
          const res = await fetch("/api/admin/users");
          if (res.ok) {
            const data = await res.json();
            setUsers(data);
          }
        } else if (activeTab === "cards") {
          const res = await fetch("/api/admin/cards");
          if (res.ok) {
            const data = await res.json();
            setCards(data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [activeTab]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4 shadow-sm">
        <h1 className="font-display text-2xl font-bold text-gray-900">
          관리자 대시보드
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {session?.user?.email}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b bg-white">
        <div className="flex gap-8 px-6">
          {(["stats", "users", "cards"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-1 py-4 font-medium transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab === "stats"
                ? "📊 통계"
                : tab === "users"
                  ? "👥 사용자"
                  : "📇 카드"}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="text-center text-gray-500">로딩 중...</div>
        ) : activeTab === "stats" && stats ? (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">총 사용자</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stats.totalUsers}
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">총 카드</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stats.totalCards}
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">총 스캔</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stats.totalScans}
                </p>
              </div>
            </div>

            {/* Recent Users */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900">최근 가입</h2>
              <div className="mt-4 space-y-3">
                {stats.recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between border-b py-3 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : activeTab === "users" ? (
          <div className="rounded-lg bg-white shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    이름
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    이메일
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    역할
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    카드 수
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.role === "admin" ? "관리자" : "사용자"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user._count.cards}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          if (confirm("정말로 삭제하시겠습니까?")) {
                            fetch("/api/admin/users", {
                              method: "DELETE",
                              body: JSON.stringify({ userId: user.id }),
                            }).then(() => {
                              setUsers(users.filter((u) => u.id !== user.id));
                            });
                          }
                        }}
                        className="text-sm text-red-600 hover:text-red-900"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-lg bg-white shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    사용자
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    공유 링크
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    스캔
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    생성일
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {cards.map((card) => (
                  <tr key={card.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {card.user.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {card.shareSlug}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {card.scans}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(card.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          if (confirm("정말로 삭제하시겠습니까?")) {
                            fetch("/api/admin/cards", {
                              method: "DELETE",
                              body: JSON.stringify({ cardId: card.id }),
                            }).then(() => {
                              setCards(cards.filter((c) => c.id !== card.id));
                            });
                          }
                        }}
                        className="text-sm text-red-600 hover:text-red-900"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
