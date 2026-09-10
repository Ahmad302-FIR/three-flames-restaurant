import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import { Order, OrderStatus } from '../../types';
import { Button } from '../../components/common/Button';
import { FlameIcon } from '../../components/common/FlameIcon';
import { useAppDispatch } from '../../store/store';
import { addToast } from '../../store/slices/uiSlice';
import {
  ShoppingBag,
  Search,
  Filter,
  Clock,
  Printer,
  X,
  Eye,
  CheckCircle2,
  Bike,
  Store,
  Utensils,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Copy,
  Check,
} from 'lucide-react';
import { joinAdminKitchen, onAdminOrderUpdate } from '../../services/socketService';

export const AdminOrdersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [proofOrder, setProofOrder] = useState<Order | null>(null);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [verifyingAction, setVerifyingAction] = useState<'approve' | 'reject' | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [copiedTxId, setCopiedTxId] = useState<string | null>(null);

  const handleCopyTxId = (txId: string) => {
    try {
      navigator.clipboard.writeText(txId);
      setCopiedTxId(txId);
      setTimeout(() => setCopiedTxId(null), 2500);
    } catch {}
  };

  const fetchOrders = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(true);
    joinAdminKitchen();
    const cleanup = onAdminOrderUpdate(() => {
      fetchOrders(false);
    });
    const interval = setInterval(() => {
      fetchOrders(false);
    }, 10000);
    return () => {
      cleanup();
      clearInterval(interval);
    };
  }, []);

  const handleVerifyPayment = async (orderId: string, action: 'approve' | 'reject', reason?: string) => {
    setVerifyingAction(action);
    try {
      const updated = await orderService.verifyPayment(orderId, action, reason);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      if (activeOrder && activeOrder.id === orderId) {
        setActiveOrder(updated);
      }
      setIsProofModalOpen(false);
      setProofOrder(null);
      setIsRejecting(false);
      setRejectReason('');
      dispatch(
        addToast({
          type: action === 'approve' ? 'success' : 'info',
          title: action === 'approve' ? 'Payment Approved 🔥' : 'Payment Rejected',
          message:
            action === 'approve'
              ? `Order #${orderId} payment verified and confirmed!`
              : `Order #${orderId} marked as rejected.`,
        })
      );
    } catch (e: any) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Verification Failed',
          message: e.message || 'Could not process payment verification.',
        })
      );
    } finally {
      setVerifyingAction(null);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const updated = await orderService.updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      if (activeOrder && activeOrder.id === orderId) {
        setActiveOrder(updated);
      }
      dispatch(
        addToast({
          type: 'success',
          title: 'Order Status Changed',
          message: `Order #${orderId} is now "${status.replace(/_/g, ' ')}".`,
        })
      );
    } catch (e) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Update Failed',
          message: 'Could not change status.',
        })
      );
    }
  };

  const pendingVerificationCount = orders.filter(
    (o) => o.status === 'payment_verification' || o.paymentStatus === 'submitted'
  ).length;

  const filterTabs = [
    { id: 'all', label: 'All Orders' },
    {
      id: 'payment_verification',
      label: `Verification ${pendingVerificationCount > 0 ? `(${pendingVerificationCount})` : ''}`,
      badge: pendingVerificationCount,
    },
    { id: 'pending', label: 'Pending' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'preparing', label: 'On Flame Grill' },
    { id: 'out_for_delivery', label: 'Out for Delivery' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  const filteredOrders = orders.filter((ord) => {
    if (selectedStatus !== 'all') {
      if (selectedStatus === 'payment_verification') {
        const isVerif = ord.status === 'payment_verification' || ord.paymentStatus === 'submitted';
        if (!isVerif) return false;
      } else if (ord.status !== selectedStatus) {
        return false;
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = (ord.orderNumber || ord.id).toLowerCase().includes(q);
      const matchName = ord.customer.name.toLowerCase().includes(q);
      const matchPhone = ord.customer.phone.toLowerCase().includes(q);
      return matchId || matchName || matchPhone;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#25201D] flex items-center gap-2">
            <ShoppingBag size={24} className="text-[#B85C38]" />
            Live Kitchen Order Queue
          </h1>
          <p className="text-xs text-[#6F6761] mt-1">
            Dispatch, update status, verify online payments, and print receipts for home delivery, takeaway, and dine-in.
          </p>
        </div>

        <Button variant="secondary" size="sm" onClick={() => fetchOrders(true)} isLoading={loading}>
          Refresh Queue
        </Button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#FFFFFF] border border-[#E8DED6]">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedStatus === tab.id
                  ? 'bg-[#B85C38] text-white shadow-md'
                  : tab.id === 'payment_verification' && (tab.badge || 0) > 0
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                  : 'bg-[#F7F3EE] text-[#6F6761] hover:text-[#25201D] border border-[#E8DED6]'
              }`}
            >
              {tab.label}
              {tab.id === 'payment_verification' && (tab.badge || 0) > 0 && selectedStatus !== tab.id && (
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
              )}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F6761]" />
          <input
            type="text"
            placeholder="Search order ID or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs text-[#25201D] placeholder-[#6F6761]/60 focus:outline-none focus:border-[#E8DED6]"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-[#FFFFFF] border border-[#E8DED6] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F3EE] text-[#6F6761] font-bold uppercase tracking-wider text-[11px] border-b border-[#E8DED6]">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Time & Mode</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Items Summary</th>
                <th className="p-4">Bill Amount</th>
                <th className="p-4">Live Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DED6]">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#F7F3EE]/60 transition-colors">
                  <td className="p-4 font-bold text-[#B85C38]">#{ord.id}</td>
                  <td className="p-4">
                    <span className="font-semibold text-[#25201D] block">
                      {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-[10px] text-[#B85C38] capitalize">
                      {ord.orderType}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-[#25201D] block">{ord.customer.name}</span>
                    <span className="text-[11px] text-[#6F6761]">{ord.customer.phone}</span>
                    {ord.deliveryDetails?.area && (
                      <span className="text-[10px] text-[#B85C38] block">
                        Area: {ord.deliveryDetails.area}
                      </span>
                    )}
                  </td>
                  <td className="p-4 max-w-xs">
                    <div className="text-[#25201D] line-clamp-2">
                      {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>
                  </td>
                  <td className="p-4 font-extrabold text-[#25201D]">
                    Rs. {ord.total.toLocaleString()}
                  </td>
                  <td className="p-4">
                    {ord.status === 'payment_verification' || ord.paymentStatus === 'submitted' ? (
                      <div className="space-y-1.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-300 font-bold text-[10px] uppercase tracking-wider animate-pulse">
                          ⚠️ VERIFICATION REQUIRED
                        </span>
                        {ord.paymentScreenshot && (
                          <button
                            type="button"
                            onClick={() => {
                              setProofOrder(ord);
                              setIsProofModalOpen(true);
                            }}
                            className="block w-full px-2.5 py-1 rounded-lg bg-[#B85C38] text-white hover:bg-[#9c4b2b] text-[10px] font-bold tracking-wider uppercase transition-colors shadow-sm text-center"
                          >
                            VIEW PAYMENT PROOF
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateStatus(ord.id, e.target.value as OrderStatus)}
                          className="bg-[#FFFFFF] hover:bg-[#F7F3EE] border border-[#E8DED6] focus:border-[#B85C38] text-xs text-[#25201D] font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none transition-colors cursor-pointer shadow-sm w-full"
                        >
                          <option value="pending" className="bg-[#FFFFFF] text-[#25201D]">Pending</option>
                          <option value="confirmed" className="bg-[#FFFFFF] text-[#25201D]">Confirmed</option>
                          <option value="preparing" className="bg-[#FFFFFF] text-[#25201D]">On Flame Grill</option>
                          <option value="out_for_delivery" className="bg-[#FFFFFF] text-[#25201D]">Out for Delivery</option>
                          <option value="delivered" className="bg-[#FFFFFF] text-[#25201D]">Delivered</option>
                          <option value="cancelled" className="bg-[#FFFFFF] text-[#25201D]">Cancelled</option>
                        </select>
                        {ord.paymentStatus === 'verified' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                            <CheckCircle2 size={11} /> Verified ({ord.paymentProvider ? ord.paymentProvider.toUpperCase() : 'Online'})
                          </span>
                        )}
                        {ord.paymentStatus === 'rejected' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-700">
                            <AlertCircle size={11} /> Payment Rejected
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-right space-y-1.5">
                    <button
                      onClick={() => {
                        setActiveOrder(ord);
                        setIsReceiptModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#F7F3EE] border border-[#E8DED6] hover:border-[#B85C38]/40 text-[#25201D] hover:text-[#B85C38] text-xs font-semibold flex items-center gap-1 ml-auto transition-colors"
                    >
                      <Eye size={13} /> Details
                    </button>
                    {ord.paymentScreenshot && (
                      <button
                        type="button"
                        onClick={() => {
                          setProofOrder(ord);
                          setIsProofModalOpen(true);
                        }}
                        className="px-3 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-[11px] font-semibold flex items-center gap-1 ml-auto transition-colors"
                        title="View Payment Transfer Proof"
                      >
                        <ImageIcon size={12} /> Proof
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details & Receipt Modal */}
      {isReceiptModalOpen && activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-lg w-full rounded-3xl bg-[#FFFFFF] border border-[#E8DED6] p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DED6]">
              <div className="flex items-center gap-2">
                <FlameIcon size={22} />
                <h3 className="text-lg font-bold font-heading text-[#25201D]">
                  Order Slip #{activeOrder.orderNumber || activeOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setIsReceiptModalOpen(false)}
                className="p-1.5 rounded-lg bg-[#F7F3EE] text-[#6F6761] hover:text-[#25201D]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Customer & Delivery Information */}
            <div className="p-4 rounded-2xl bg-[#F7F3EE] border border-[#E8DED6] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#6F6761]">Customer:</span>
                <span className="font-bold text-[#25201D]">{activeOrder.customer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6F6761]">Phone:</span>
                <span className="text-[#25201D] font-semibold">{activeOrder.customer.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6F6761]">Order Type:</span>
                <span className="font-bold text-[#B85C38] uppercase">{activeOrder.orderType}</span>
              </div>
              {activeOrder.deliveryDetails && (
                <div className="pt-2 border-t border-[#E8DED6]">
                  <span className="text-[#6F6761] block">Address:</span>
                  <span className="text-[#25201D] font-medium">
                    {activeOrder.deliveryDetails.address}, {activeOrder.deliveryDetails.area}
                  </span>
                </div>
              )}
            </div>

            {/* Online Payment Proof section if present */}
            {activeOrder.paymentMethod === 'online' && (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-amber-900 uppercase tracking-wider text-[11px]">Online Payment Transfer</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    activeOrder.paymentStatus === 'verified'
                      ? 'bg-emerald-100 text-emerald-800'
                      : activeOrder.paymentStatus === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}>
                    {activeOrder.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6F6761]">Channel:</span>
                  <span className="font-bold text-[#25201D] capitalize">{activeOrder.paymentProvider || 'Online'}</span>
                </div>
                {activeOrder.transactionId && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#6F6761]">Transaction ID:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-[#25201D]">{activeOrder.transactionId}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyTxId(activeOrder.transactionId!)}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#F1E8DF] hover:bg-[#E5D7C8] text-[#554B45] transition-colors"
                        title="Copy Transaction ID"
                      >
                        {copiedTxId === activeOrder.transactionId ? (
                          <>
                            <Check size={11} className="text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={11} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
                {activeOrder.paymentScreenshot && (
                  <button
                    type="button"
                    onClick={() => {
                      setProofOrder(activeOrder);
                      setIsProofModalOpen(true);
                    }}
                    className="w-full mt-2 py-2 rounded-xl bg-[#B85C38] text-white hover:bg-[#9c4b2b] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ImageIcon size={14} /> Open Payment Proof Lightbox
                  </button>
                )}
              </div>
            )}

            {/* Items Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#B85C38]">
                Ordered Culinary Items
              </h4>
              <div className="divide-y divide-[#E8DED6] text-xs">
                {activeOrder.items.map((it) => (
                  <div key={it.id} className="py-2.5 flex justify-between items-start">
                    <div>
                      <span className="font-bold text-[#25201D]">
                        {it.quantity}x {it.name}
                      </span>
                      {it.selectedAddOns && it.selectedAddOns.length > 0 && (
                        <div className="text-[10px] text-[#6F6761]">
                          +{it.selectedAddOns.map((a) => a.name).join(', ')}
                        </div>
                      )}
                      {it.specialInstructions && (
                        <div className="text-[10px] text-[#B85C38] italic">
                          "{it.specialInstructions}"
                        </div>
                      )}
                    </div>
                    <span className="font-bold text-[#B85C38]">
                      Rs. {it.itemTotal.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="pt-4 border-t border-[#E8DED6] text-xs space-y-1.5">
              <div className="flex justify-between text-[#6F6761]">
                <span>Subtotal</span>
                <span className="text-[#25201D] font-bold">Rs. {activeOrder.subtotal.toLocaleString()}</span>
              </div>
              {activeOrder.deliveryFee > 0 && (
                <div className="flex justify-between text-[#6F6761]">
                  <span>Delivery Fee</span>
                  <span className="text-[#25201D] font-bold">Rs. {activeOrder.deliveryFee.toLocaleString()}</span>
                </div>
              )}
              {activeOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Discount</span>
                  <span>- Rs. {activeOrder.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="pt-2 flex justify-between text-base font-extrabold text-[#B85C38]">
                <span>Total Amount:</span>
                <span>Rs. {activeOrder.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Print Slip Action */}
            <div className="pt-4 flex gap-3">
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() => {
                  window.print();
                }}
                leftIcon={<Printer size={16} />}
              >
                Print Kitchen KOT / Receipt
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Proof Lightbox Modal */}
      {isProofModalOpen && proofOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="max-w-2xl w-full rounded-3xl bg-[#FFFFFF] border border-[#E8DED6] p-6 sm:p-8 space-y-5 shadow-2xl overflow-y-auto max-h-[95vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DED6]">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#B85C38] block">
                  Payment Verification Moderation
                </span>
                <h3 className="text-xl font-black font-heading text-[#25201D]">
                  Order #{proofOrder.orderNumber || proofOrder.id}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsProofModalOpen(false);
                  setProofOrder(null);
                  setRejectReason('');
                  setIsRejecting(false);
                }}
                className="p-1.5 rounded-lg bg-[#F7F3EE] text-[#6F6761] hover:text-[#25201D]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Order & Customer Summary Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-[#F7F3EE] border border-[#E8DED6] text-xs">
              <div>
                <span className="text-[#6F6761] block text-[10px] uppercase font-semibold">Customer</span>
                <span className="font-bold text-[#25201D] truncate block">{proofOrder.customer.name}</span>
                <span className="text-[11px] text-[#6F6761]">{proofOrder.customer.phone}</span>
              </div>
              <div>
                <span className="text-[#6F6761] block text-[10px] uppercase font-semibold">Bill Amount</span>
                <span className="text-sm font-black text-[#B85C38] block">Rs. {proofOrder.total.toLocaleString()}</span>
                <span className="text-[10px] text-[#6F6761] capitalize">{proofOrder.orderType}</span>
              </div>
              <div>
                <span className="text-[#6F6761] block text-[10px] uppercase font-semibold">Method / Status</span>
                <span className="font-bold text-[#25201D] capitalize block">{proofOrder.paymentProvider || 'Online'}</span>
                <span className={`text-[10px] font-bold uppercase ${
                  proofOrder.paymentStatus === 'verified'
                    ? 'text-emerald-700'
                    : proofOrder.paymentStatus === 'rejected'
                    ? 'text-red-700'
                    : 'text-amber-700'
                }`}>
                  {proofOrder.paymentStatus}
                </span>
              </div>
              <div>
                <span className="text-[#6F6761] block text-[10px] uppercase font-semibold">Transaction ID</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono font-bold text-[#25201D] text-xs block break-all">
                    {proofOrder.transactionId || 'None'}
                  </span>
                  {proofOrder.transactionId && (
                    <button
                      type="button"
                      onClick={() => handleCopyTxId(proofOrder.transactionId!)}
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#F1E8DF] hover:bg-[#E5D7C8] text-[#554B45] transition-colors shrink-0"
                      title="Copy Transaction ID"
                    >
                      {copiedTxId === proofOrder.transactionId ? (
                        <>
                          <Check size={11} className="text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={11} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Screenshot Display Box */}
            <div className="p-3 rounded-2xl bg-[#1D1917] flex flex-col items-center justify-center relative overflow-hidden">
              {proofOrder.paymentScreenshot ? (
                <>
                  <img
                    src={proofOrder.paymentScreenshot}
                    alt={`Payment proof for order ${proofOrder.id}`}
                    className="max-h-[50vh] w-auto object-contain rounded-lg shadow-lg"
                  />
                  <a
                    href={proofOrder.paymentScreenshot}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 text-xs text-white/80 hover:text-white underline flex items-center gap-1 transition-colors"
                  >
                    Open full resolution in new tab <ExternalLink size={13} />
                  </a>
                </>
              ) : (
                <div className="py-12 text-center text-white/60 text-xs">
                  No payment screenshot uploaded for this order.
                </div>
              )}
            </div>

            {/* Rejection Note Input (if expanding reject) */}
            {isRejecting && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-2">
                <label className="block text-xs font-bold text-red-900">
                  Rejection Reason / Note to Customer:
                </label>
                <input
                  type="text"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Transfer amount does not match or screenshot illegible"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-red-300 text-xs text-red-900 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>
            )}

            {/* Moderation Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                size="md"
                fullWidth
                isLoading={verifyingAction === 'approve'}
                onClick={() => handleVerifyPayment(proofOrder.id, 'approve')}
                leftIcon={<CheckCircle2 size={16} />}
                className="bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
              >
                APPROVE PAYMENT & CONFIRM ORDER
              </Button>

              {!isRejecting ? (
                <Button
                  variant="secondary"
                  size="md"
                  fullWidth
                  onClick={() => setIsRejecting(true)}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  REJECT PAYMENT
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="md"
                  fullWidth
                  isLoading={verifyingAction === 'reject'}
                  onClick={() => handleVerifyPayment(proofOrder.id, 'reject', rejectReason)}
                  className="bg-red-600 hover:bg-red-700 text-white border-red-600"
                >
                  CONFIRM REJECTION
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
