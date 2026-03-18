import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/admin/login')
  }

  // Get dashboard stats
  const [articles, notices, obituaries, features, totalRevenue, recentPayments] =
    await Promise.all([
      prisma.article.count({ where: { published: true } }),
      prisma.legalNotice.count({ where: { status: 'published' } }),
      prisma.obituary.count({ where: { status: 'published' } }),
      prisma.feature.count({ where: { status: 'featured' } }),
      prisma.paymentRecord.aggregate({
        _sum: { amount: true },
        where: { status: 'completed' },
      }),
      prisma.paymentRecord.findMany({
        where: { status: 'completed' },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ])

  const totalRevenueFigure = recentPayments.reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="min-h-screen bg-jersey-gray">
      <div className="container-wide py-8">
        <h1 className="font-playfair text-4xl font-bold text-jersey-navy mb-8">
          Admin Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <StatCard
            label="Published Articles"
            value={articles}
            icon="📰"
            href="/admin/articles"
          />
          <StatCard
            label="Legal Notices"
            value={notices}
            icon="📋"
            href="/admin/notices"
          />
          <StatCard
            label="Obituaries"
            value={obituaries}
            icon="🕊️"
            href="/admin/obituaries"
          />
          <StatCard
            label="Featured"
            value={features}
            icon="⭐"
            href="/admin/features"
          />
          <StatCard
            label="Revenue"
            value={`$${totalRevenueFigure.toFixed(0)}`}
            icon="💰"
            href="/admin/revenue"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="card bg-jersey-navy text-white border-0">
              <h2 className="font-playfair text-2xl font-bold mb-6 text-jersey-gold">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link
                  href="/admin/articles/new"
                  className="block px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-center font-semibold"
                >
                  ✏️ Create Article
                </Link>
                <Link
                  href="/admin/notices"
                  className="block px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-center font-semibold"
                >
                  📋 Review Notices
                </Link>
                <Link
                  href="/admin/obituaries"
                  className="block px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-center font-semibold"
                >
                  🕊️ Review Obituaries
                </Link>
                <Link
                  href="/admin/revenue"
                  className="block px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-center font-semibold"
                >
                  💰 Revenue Report
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Payments */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="font-playfair text-2xl font-bold text-jersey-navy mb-6">
                Recent Payments
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-jersey-gold">
                      <th className="text-left py-3 font-bold text-jersey-navy">Type</th>
                      <th className="text-left py-3 font-bold text-jersey-navy">Amount</th>
                      <th className="text-left py-3 font-bold text-jersey-navy">Date</th>
                      <th className="text-left py-3 font-bold text-jersey-navy">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPayments.length > 0 ? (
                      recentPayments.map((payment) => (
                        <tr key={payment.id} className="border-b border-gray-200 hover:bg-jersey-gray">
                          <td className="py-3 text-gray-700 capitalize">
                            {payment.type.replace('-', ' ')}
                          </td>
                          <td className="py-3 font-bold text-jersey-navy">
                            ${payment.amount.toFixed(2)}
                          </td>
                          <td className="py-3 text-gray-600">
                            {payment.createdAt.toLocaleDateString()}
                          </td>
                          <td className="py-3">
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-gray-500">
                          No payments yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
  href,
}: {
  label: string
  value: string | number
  icon: string
  href: string
}) {
  return (
    <Link href={href}>
      <div className="card bg-white border border-gray-200 hover:border-jersey-gold hover:shadow-lg transition-all cursor-pointer">
        <div className="text-4xl mb-4">{icon}</div>
        <p className="text-gray-600 text-sm mb-2">{label}</p>
        <p className="font-playfair text-3xl font-bold text-jersey-navy">{value}</p>
      </div>
    </Link>
  )
}
