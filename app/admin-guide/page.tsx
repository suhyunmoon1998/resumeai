"use client";

import Link from "next/link";

export default function AdminGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">
            관리자 대시보드 가이드
          </h1>
          <p className="text-gray-600">VoiceResume 관리자 대시보드 사용 방법</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Navigation */}
        <div className="mb-8 flex gap-4">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            🛠️ 관리자 페이지로 이동
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            ← 홈으로
          </Link>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {/* Overview */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 대시보드 개요</h2>
            <p className="text-gray-600 mb-4">
              관리자 대시보드는 VoiceResume의 모든 사용자와 카드를 관리할 수 있는 중앙 허브입니다.
              실시간 통계, 사용자 관리, 카드 관리 기능을 제공합니다.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <p className="text-sm text-blue-900">
                <strong>접근 권한:</strong> 관리자 역할이 있는 사용자만 접근 가능합니다.
              </p>
            </div>
          </section>

          {/* Features */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">🎯 주요 기능</h2>

            {/* Stats */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="text-4xl">📊</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">1. 통계 (Stats)</h3>
                  <p className="text-gray-600 mb-4">
                    앱의 주요 지표를 한눈에 볼 수 있습니다.
                  </p>
                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900">📈 총 사용자</p>
                      <p className="text-sm text-gray-600">가입한 전체 사용자 수</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">📇 총 카드</p>
                      <p className="text-sm text-gray-600">생성된 전체 이력서 카드 수</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">📲 총 스캔</p>
                      <p className="text-sm text-gray-600">모든 카드의 QR 스캔 횟수 합계</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">👤 최근 가입</p>
                      <p className="text-sm text-gray-600">최근 10명의 신규 사용자 목록</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Users */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="text-4xl">👥</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">2. 사용자 관리 (Users)</h3>
                  <p className="text-gray-600 mb-4">
                    모든 사용자를 관리하고 필요한 조치를 취할 수 있습니다.
                  </p>
                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900">📋 사용자 목록</p>
                      <p className="text-sm text-gray-600">이름, 이메일, 역할, 카드 수 표시</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">🏷️ 역할 표시</p>
                      <p className="text-sm text-gray-600">
                        <span className="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs mr-2">관리자</span>
                        또는
                        <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs ml-2">사용자</span>
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">🗑️ 사용자 삭제</p>
                      <p className="text-sm text-gray-600">우측 "삭제" 버튼으로 사용자 제거 (사용자의 모든 카드도 함께 삭제됨)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cards */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="text-4xl">📇</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">3. 카드 관리 (Cards)</h3>
                  <p className="text-gray-600 mb-4">
                    모든 사용자의 이력서 카드를 한 곳에서 관리합니다.
                  </p>
                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900">👤 사용자</p>
                      <p className="text-sm text-gray-600">카드 소유자의 이름</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">🔗 공유 링크</p>
                      <p className="text-sm text-gray-600">카드의 고유한 공유 슬러그</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">📲 스캔</p>
                      <p className="text-sm text-gray-600">해당 카드의 QR 코드 스캔 횟수</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">📅 생성일</p>
                      <p className="text-sm text-gray-600">카드 생성 날짜</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">🗑️ 카드 삭제</p>
                      <p className="text-sm text-gray-600">우측 "삭제" 버튼으로 카드 제거</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How to Use */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🚀 사용 방법</h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">관리자 페이지 접속</h4>
                  <p className="text-gray-600">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">/admin</code> 주소로 접속합니다.
                    관리자 권한이 있는 계정으로 로그인되어 있어야 합니다.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">탭 선택</h4>
                  <p className="text-gray-600">
                    상단의 탭에서 원하는 섹션을 선택합니다:
                    <br />📊 통계 | 👥 사용자 | 📇 카드
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">정보 확인</h4>
                  <p className="text-gray-600">
                    각 탭에서 필요한 정보를 확인합니다.
                    테이블은 최근 데이터 순으로 정렬되어 있습니다.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">필요시 삭제</h4>
                  <p className="text-gray-600">
                    문제가 있는 사용자나 카드를 우측의 "삭제" 버튼으로 제거합니다.
                    <br />⚠️ 삭제는 되돌릴 수 없으므로 주의하세요!
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Tips */}
          <section className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 border-2 border-purple-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">💡 팁 & 주의사항</h2>

            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className="text-xl">✅</span>
                <div>
                  <p className="font-semibold text-gray-900">정기적으로 확인하기</p>
                  <p className="text-sm text-gray-600">통계를 정기적으로 확인해서 앱의 성장을 추적하세요.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-xl">⚠️</span>
                <div>
                  <p className="font-semibold text-gray-900">삭제는 신중하게</p>
                  <p className="text-sm text-gray-600">사용자 삭제 시 그 사용자의 모든 카드도 함께 삭제됩니다.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-xl">📊</span>
                <div>
                  <p className="font-semibold text-gray-900">스캔 수로 인기도 파악</p>
                  <p className="text-sm text-gray-600">각 카드의 스캔 수로 어느 카드가 인기인지 알 수 있습니다.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-xl">🔒</span>
                <div>
                  <p className="font-semibold text-gray-900">관리자 권한 관리</p>
                  <p className="text-sm text-gray-600">관리자는 신뢰할 수 있는 사람에게만 권한을 부여하세요.</p>
                </div>
              </li>
            </ul>
          </section>

          {/* FAQ */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">❓ 자주 묻는 질문</h2>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Q: 관리자가 되려면?</h4>
                <p className="text-gray-600 text-sm">
                  A: 데이터베이스에서 직접 사용자의 role을 'admin'으로 변경해야 합니다.
                  또는 초기 설정 시 관리자 권한을 부여받을 수 있습니다.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Q: 삭제한 데이터를 복구할 수 있나요?</h4>
                <p className="text-gray-600 text-sm">
                  A: 아니요, 삭제는 영구적입니다. 따라서 신중하게 삭제하세요!
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Q: 통계는 실시간인가요?</h4>
                <p className="text-gray-600 text-sm">
                  A: 네, 통계는 실시간으로 업데이트됩니다.
                  페이지를 새로고침하면 최신 데이터를 볼 수 있습니다.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Q: 여러 관리자를 둘 수 있나요?</h4>
                <p className="text-gray-600 text-sm">
                  A: 네, 여러 명의 관리자를 둘 수 있습니다.
                  각 관리자는 동일한 권한을 가집니다.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">준비되셨나요?</h2>
            <p className="mb-6 text-blue-100">
              이제 관리자 대시보드에서 앱을 관리해보세요!
            </p>
            <Link
              href="/admin"
              className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              관리자 페이지로 이동 →
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
