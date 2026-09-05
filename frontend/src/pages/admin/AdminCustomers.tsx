import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Customer } from '../../types';
import { Users, Search, Phone, Mail, ShoppingBag, Award, Shield } from 'lucide-react';

export const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getCustomers();
      setCustomers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filtered = customers.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white flex items-center gap-2">
            <Users size={24} className="text-[#FF8A1F]" />
            Registered Diners & Loyalty Profiles
          </h1>
          <p className="text-xs text-[#B8AAA0] mt-1">
            Real customer database records with order histories, lifetime spend, and VIP tiers.
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[#120B08] border border-[#FF8A1F]/20 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B8AAA0]" />
          <input
            type="text"
            placeholder="Search by customer name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-xs text-white placeholder-[#B8AAA0]/60 focus:outline-none"
          />
        </div>
        <span className="text-xs text-[#B8AAA0]">Total: <strong className="text-white">{filtered.length}</strong> customers</span>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-[#B8AAA0]">Loading diner directory...</div>
      ) : (
        <div className="rounded-2xl bg-[#120B08] border border-[#FF8A1F]/20 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1A100C] text-[#B8AAA0] font-bold uppercase tracking-wider text-[11px] border-b border-white/10">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Orders Placed</th>
                  <th className="p-4">Lifetime Spend</th>
                  <th className="p-4">Last Order</th>
                  <th className="p-4">Tier Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((cust) => (
                  <tr key={cust.id} className="hover:bg-[#1A100C]/60 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/40 flex items-center justify-center font-bold text-xs text-[#FF8A1F]">
                          {cust.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-white block">{cust.name}</span>
                          <span className="text-[10px] text-[#B8AAA0]">Joined {cust.joinedDate || '2025'}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 space-y-0.5">
                      <div className="flex items-center gap-1 text-[#B8AAA0]">
                        <Mail size={12} className="text-[#FF8A1F]" />
                        <span>{cust.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#B8AAA0]">
                        <Phone size={12} className="text-emerald-400" />
                        <span>{cust.phone}</span>
                      </div>
                    </td>

                    <td className="p-4 font-bold text-white">
                      <span className="flex items-center gap-1">
                        <ShoppingBag size={13} className="text-[#FF8A1F]" />
                        {cust.ordersCount} orders
                      </span>
                    </td>

                    <td className="p-4 font-extrabold text-[#FF8A1F]">
                      Rs. {cust.totalSpent.toLocaleString()}
                    </td>

                    <td className="p-4 text-[#B8AAA0]">
                      {cust.lastOrderDate || 'N/A'}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                          cust.status === 'vip'
                            ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {cust.status === 'vip' ? <Award size={12} /> : <Shield size={12} />}
                        {cust.status === 'vip' ? 'VIP Patron' : 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
