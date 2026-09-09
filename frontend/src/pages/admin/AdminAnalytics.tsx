import React from 'react';
import { SectionHeading } from '../../components/common/SectionHeading';
import { FlameIcon } from '../../components/common/FlameIcon';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Users,
  ShoppingBag,
  DollarSign,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  const weeklyData = [
    { day: 'Mon', revenue: 145000, orders: 48 },
    { day: 'Tue', revenue: 162000, orders: 52 },
    { day: 'Wed', revenue: 178000, orders: 59 },
    { day: 'Thu', revenue: 195000, orders: 66 },
    { day: 'Fri', revenue: 285000, orders: 94 },
    { day: 'Sat', revenue: 340000, orders: 112 },
    { day: 'Sun', revenue: 310000, orders: 105 },
  ];

  const categoryBreakdown = [
    { category: 'Sajji Specialties', percentage: 38, revenue: 'Rs. 614,000', color: 'bg-[#C97845]' },
    { category: 'Shinwari & Karahi', percentage: 28, revenue: 'Rs. 452,000', color: 'bg-[#D6A15D]' },
    { category: 'Charcoal BBQ Skewers', percentage: 18, revenue: 'Rs. 290,000', color: 'bg-[#C97845]' },
    { category: 'Kabuli Pulao & Rice', percentage: 11, revenue: 'Rs. 177,000', color: 'bg-amber-500' },
    { category: 'Naan & Beverages', percentage: 5, revenue: 'Rs. 82,000', color: 'bg-emerald-500' },
  ];

  const orderTypes = [
    { type: 'Home Delivery (Peshawar)', share: '56%', count: '298 Orders' },
    { type: 'Dine-In Table Seating', share: '32%', count: '170 Bookings' },
    { type: 'Self Takeaway Pickup', share: '12%', count: '64 Pickups' },
  ];

  const maxRevenue = Math.max(...weeklyData.map((d) => d.revenue));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white flex items-center gap-2">
          <BarChart3 size={24} className="text-[#C97845]" />
          Sales & Gastronomy Analytics
        </h1>
        <p className="text-xs text-[#BDB1A5] mt-1">
          Weekly turnover, category market shares, channel velocity, and customer retention metrics.
        </p>
      </div>

      {/* Top Highlights Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-[#28221D] border border-[#51463D] shadow-lg space-y-2">
          <span className="text-xs font-bold uppercase text-[#BDB1A5]">This Week's Turnover</span>
          <div className="text-3xl font-black font-heading text-white">Rs. 1,615,000</div>
          <div className="text-xs text-emerald-400 font-bold flex items-center gap-1">
            <TrendingUp size={14} /> +22.4% vs last week
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#28221D] border border-[#51463D] shadow-lg space-y-2">
          <span className="text-xs font-bold uppercase text-[#BDB1A5]">Average Ticket Size</span>
          <div className="text-3xl font-black font-heading text-[#C97845]">Rs. 3,018</div>
          <div className="text-xs text-[#D6A15D]">Family platters drive +45% average order value</div>
        </div>

        <div className="p-6 rounded-2xl bg-[#28221D] border border-[#51463D] shadow-lg space-y-2">
          <span className="text-xs font-bold uppercase text-[#BDB1A5]">Customer Rating Index</span>
          <div className="text-3xl font-black font-heading text-white">4.92 / 5.0</div>
          <div className="text-xs text-emerald-400">96.8% positive kitchen sentiment</div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Weekly Revenue Bar Chart */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-[#28221D] border border-[#51463D] space-y-6 shadow-2xl">
          <div className="flex justify-between items-center pb-4 border-b border-[#51463D]">
            <div>
              <h3 className="text-base font-bold font-heading text-white">Weekly Revenue Trajectory</h3>
              <p className="text-xs text-[#BDB1A5]">Daily sales breakdown for the current 7-day period</p>
            </div>
            <span className="text-xs font-bold text-[#C97845]">Peshawar Campus</span>
          </div>

          {/* Bar Chart Visual */}
          <div className="h-64 flex items-end justify-between gap-3 pt-8 px-2">
            {weeklyData.map((day) => {
              const heightPercent = (day.revenue / maxRevenue) * 100;
              return (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[10px] text-[#BDB1A5] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                    Rs. {(day.revenue / 1000).toFixed(0)}k
                  </div>
                  <div className="w-full bg-[#332B25] rounded-xl h-48 relative overflow-hidden flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-[#C97845] to-[#C97845] rounded-xl transition-all duration-700 group-hover:brightness-125"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-white mt-1">{day.day}</span>
                  <span className="text-[10px] text-[#BDB1A5]">{day.orders} ord</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Share Breakdown */}
        <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-[#28221D] border border-[#51463D] space-y-5 shadow-2xl">
          <div>
            <h3 className="text-base font-bold font-heading text-white">Revenue by Menu Category</h3>
            <p className="text-xs text-[#BDB1A5]">Dominant culinary revenue drivers</p>
          </div>

          <div className="space-y-4 pt-2">
            {categoryBreakdown.map((cat, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-white">{cat.category}</span>
                  <span className="font-bold text-[#C97845]">{cat.percentage}%</span>
                </div>
                <div className="h-2 rounded-full bg-[#332B25] overflow-hidden">
                  <div
                    className={`h-full ${cat.color} rounded-full`}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Channel breakdown */}
          <div className="pt-6 border-t border-[#51463D] space-y-3">
            <h4 className="text-xs font-bold uppercase text-[#D6A15D]">Fulfillment Channels</h4>
            {orderTypes.map((t, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <span className="text-[#BDB1A5]">{t.type}</span>
                <span className="font-bold text-white">{t.share}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
