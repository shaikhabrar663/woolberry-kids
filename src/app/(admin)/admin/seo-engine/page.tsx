import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminSeoEnginePage() {
  const searchQueries = await prisma.searchQuery.findMany({
    orderBy: { count: 'desc' },
    take: 20
  });

  const categories = await prisma.category.findMany();
  const existingSlugs = new Set(categories.map((c) => c.slug));

  // Determine unmet customer search demand
  const opportunities = searchQueries.map((sq) => {
    const slugCandidate = sq.query.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const hasDedicatedPage = existingSlugs.has(slugCandidate);
    
    return {
      query: sq.query,
      count: sq.count,
      suggestedSlug: `/collections/${slugCandidate}`,
      hasDedicatedPage,
      status: hasDedicatedPage ? 'Serviced' : 'High Priority Gap'
    };
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[#3D312A]">Organic Search Demand Engine</h1>
        <p className="text-sm text-[#8C827A] mt-1">
          Surfaces internal storefront searches without matching URLs to direct your landing page roadmap.
        </p>
      </div>

      <div className="bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs text-[#3D312A]">
          <thead className="bg-[#F4EFEA] border-b border-[#E8E2D9] uppercase font-bold text-[#8C827A]">
            <tr>
              <th className="py-4 px-6">Customer Search Query</th>
              <th className="py-4 px-6">Volume</th>
              <th className="py-4 px-6">Suggested Indexable URL</th>
              <th className="py-4 px-6">Architecture Status</th>
              <th className="py-4 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E2D9]">
            {opportunities.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50">
                <td className="py-4 px-6 font-semibold">"{item.query}"</td>
                <td className="py-4 px-6">{item.count} searches</td>
                <td className="py-4 px-6 font-mono text-gray-500">{item.suggestedSlug}</td>
                <td className="py-4 px-6">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    item.hasDedicatedPage ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  {!item.hasDedicatedPage && (
                    <button className="bg-[#3D312A] text-white px-3 py-1.5 rounded-lg text-[11px] font-semibold hover:bg-[#8A9A86]">
                      Create Page
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}