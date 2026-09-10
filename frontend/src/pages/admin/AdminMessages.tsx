import React, { useState, useEffect, useMemo } from 'react';
import { contactService, formatWhatsAppNumber } from '../../services/contactService';
import { ContactMessage } from '../../types';
import { Button } from '../../components/common/Button';
import { useAppDispatch } from '../../store/store';
import { addToast } from '../../store/slices/uiSlice';
import {
  Mail,
  MailOpen,
  Phone,
  Search,
  Trash2,
  ExternalLink,
  MessageCircle,
  Calendar,
  Clock,
  User,
  AlertTriangle,
  X,
  RefreshCw,
  Inbox,
  CheckCircle2,
} from 'lucide-react';

export const AdminMessagesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read'>('all');

  // Modal states
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await contactService.getAdminContactMessages();
      setMessages(data);
    } catch (err: any) {
      console.error('Failed to fetch contact inquiries', err);
      setError(err?.response?.data?.message || err?.message || 'Unable to load customer inquiries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleOpenMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    const msgId = msg.id || msg._id;
    if (!msg.isRead && msgId) {
      try {
        const updated = await contactService.markContactMessageRead(msgId);
        setMessages((prev) =>
          prev.map((m) => ((m.id || m._id) === msgId ? { ...m, isRead: true } : m))
        );
        setSelectedMessage({ ...msg, isRead: true });
      } catch (err) {
        console.error('Failed to mark message as read', err);
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget.id || deleteTarget._id;
    if (!targetId) return;

    setIsDeleting(true);
    try {
      await contactService.deleteContactMessage(targetId);
      setMessages((prev) => prev.filter((m) => (m.id || m._id) !== targetId));
      if (selectedMessage && (selectedMessage.id || selectedMessage._id) === targetId) {
        setSelectedMessage(null);
      }
      setDeleteTarget(null);
      dispatch(
        addToast({
          type: 'success',
          title: 'Message Deleted',
          message: 'Customer inquiry has been permanently removed.',
        })
      );
    } catch (err: any) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Delete Failed',
          message: err?.response?.data?.message || err?.message || 'Could not delete message. Please try again.',
        })
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      if (filterStatus === 'unread' && msg.isRead) return false;
      if (filterStatus === 'read' && !msg.isRead) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = msg.name?.toLowerCase().includes(q);
        const matchEmail = msg.email?.toLowerCase().includes(q);
        const matchPhone = msg.phone?.toLowerCase().includes(q);
        const matchSubject = msg.subject?.toLowerCase().includes(q);
        const matchMessage = msg.message?.toLowerCase().includes(q);
        return matchName || matchEmail || matchPhone || matchSubject || matchMessage;
      }
      return true;
    });
  }, [messages, filterStatus, searchQuery]);

  const totalCount = messages.length;
  const unreadCount = messages.filter((m) => !m.isRead).length;
  const readCount = totalCount - unreadCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#25201D] flex items-center gap-2">
            <Mail size={26} className="text-[#B85C38]" />
            Customer Inquiries
          </h1>
          <p className="text-xs text-[#6F6761] mt-1">
            View and manage messages received through the website contact form.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={fetchMessages}
          isLoading={loading}
          leftIcon={<RefreshCw size={14} />}
        >
          Refresh Inbox
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E8DED6] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#6F6761] uppercase tracking-wider block">
              Total Inquiries
            </span>
            <span className="text-2xl font-extrabold text-[#25201D] mt-0.5 block">{totalCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F7F3EE] flex items-center justify-center text-[#25201D]">
            <Inbox size={20} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E8DED6] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
              Unread Messages
            </span>
            <span className="text-2xl font-extrabold text-amber-700 mt-0.5 block">{unreadCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
            <Mail size={20} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E8DED6] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              Read & Answered
            </span>
            <span className="text-2xl font-extrabold text-emerald-700 mt-0.5 block">{readCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <CheckCircle2 size={20} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E8DED6] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {(['all', 'unread', 'read'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                filterStatus === st
                  ? 'bg-[#B85C38] text-white shadow-md'
                  : 'bg-[#F7F3EE] text-[#6F6761] hover:text-[#25201D] border border-[#E8DED6]'
              }`}
            >
              <span>{st}</span>
              {st === 'unread' && unreadCount > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    filterStatus === st ? 'bg-white text-[#B85C38]' : 'bg-[#B85C38] text-white'
                  }`}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F6761]" />
          <input
            type="text"
            placeholder="Search name, email, subject, message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs text-[#25201D] placeholder-[#6F6761]/60 focus:outline-none focus:border-[#B85C38]"
          />
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-rose-800">
            <AlertTriangle size={18} className="shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
          <Button variant="secondary" size="sm" onClick={fetchMessages}>
            Retry
          </Button>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="p-16 rounded-3xl bg-[#FFFFFF] border border-[#E8DED6] text-center space-y-3">
          <div className="w-10 h-10 border-3 border-[#B85C38] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#6F6761] font-semibold">Loading customer inquiries...</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        /* Empty State */
        <div className="p-16 rounded-3xl bg-[#FFFFFF] border border-[#E8DED6] text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-[#F7F3EE] border border-[#E8DED6] flex items-center justify-center mx-auto text-[#6F6761]">
            <Inbox size={26} />
          </div>
          <h3 className="text-base font-bold text-[#25201D]">
            {filterStatus === 'unread' ? 'No unread messages' : 'No customer inquiries yet'}
          </h3>
          <p className="text-xs text-[#6F6761] max-w-sm mx-auto">
            {searchQuery
              ? `No messages matched your search "${searchQuery}". Try different keywords.`
              : 'Messages submitted through the public website contact form will appear here.'}
          </p>
          {searchQuery && (
            <Button variant="secondary" size="sm" onClick={() => setSearchQuery('')}>
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        /* Desktop Table & Mobile Cards */
        <div className="rounded-2xl bg-[#FFFFFF] border border-[#E8DED6] overflow-hidden shadow-sm">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F3EE] text-[#6F6761] font-bold uppercase tracking-wider text-[11px] border-b border-[#E8DED6]">
                <tr>
                  <th className="p-4 w-10">Status</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Contact Details</th>
                  <th className="p-4">Subject & Message Preview</th>
                  <th className="p-4">Received</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DED6]">
                {filteredMessages.map((msg) => {
                  const msgId = msg.id || msg._id || '';
                  const waNumber = formatWhatsAppNumber(msg.phone);
                  const isUnread = !msg.isRead;

                  return (
                    <tr
                      key={msgId}
                      className={`hover:bg-[#F7F3EE]/60 transition-colors cursor-pointer ${
                        isUnread ? 'bg-amber-50/40 font-semibold' : ''
                      }`}
                      onClick={() => handleOpenMessage(msg)}
                    >
                      <td className="p-4">
                        {isUnread ? (
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse"
                            title="Unread message"
                          >
                            NEW
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F7F3EE] text-[#6F6761] border border-[#E8DED6]">
                            READ
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#F7F3EE] border border-[#E8DED6] flex items-center justify-center text-xs font-bold text-[#B85C38] shrink-0">
                            {msg.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <span className="font-bold text-[#25201D] block">{msg.name}</span>
                        </div>
                      </td>

                      <td className="p-4 space-y-1" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={`mailto:${msg.email}?subject=${encodeURIComponent('Re: ' + (msg.subject || 'Customer Inquiry'))}`}
                          className="text-[#B85C38] hover:underline block truncate max-w-[180px] font-medium"
                          title="Click to email customer"
                        >
                          {msg.email}
                        </a>
                        {msg.phone && (
                          <a
                            href={`tel:${msg.phone}`}
                            className="text-[#6F6761] hover:text-[#25201D] flex items-center gap-1 font-medium"
                            title="Click to call"
                          >
                            <Phone size={11} className="text-[#B85C38]" />
                            {msg.phone}
                          </a>
                        )}
                      </td>

                      <td className="p-4 max-w-xs">
                        <span className="font-bold text-[#25201D] block truncate">
                          {msg.subject || 'General Inquiry'}
                        </span>
                        <p className="text-[11px] text-[#6F6761] line-clamp-1 mt-0.5">
                          {msg.message}
                        </p>
                      </td>

                      <td className="p-4 text-[#6F6761] whitespace-nowrap">
                        <span className="block font-medium text-[#25201D]">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-[10px] text-[#6F6761]">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>

                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Modal */}
                          <button
                            onClick={() => handleOpenMessage(msg)}
                            className="px-2.5 py-1 rounded-lg bg-[#F7F3EE] text-[#25201D] hover:bg-[#E8DED6] border border-[#E8DED6] text-[11px] font-bold transition-colors"
                            title="Read full inquiry"
                          >
                            View
                          </button>

                          {/* Email */}
                          <a
                            href={`mailto:${msg.email}?subject=${encodeURIComponent('Re: ' + (msg.subject || 'Customer Inquiry'))}`}
                            className="p-1.5 rounded-lg bg-[#F7F3EE] text-[#B85C38] hover:bg-[#F3E4DC] border border-[#E8DED6] transition-colors"
                            title="Reply via Email"
                          >
                            <Mail size={14} />
                          </a>

                          {/* WhatsApp */}
                          {waNumber && (
                            <a
                              href={`https://wa.me/${waNumber}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle size={14} />
                            </a>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteTarget(msg)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors"
                            title="Delete message"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-[#E8DED6]">
            {filteredMessages.map((msg) => {
              const msgId = msg.id || msg._id || '';
              const waNumber = formatWhatsAppNumber(msg.phone);
              const isUnread = !msg.isRead;

              return (
                <div
                  key={msgId}
                  className={`p-4 space-y-3 cursor-pointer ${
                    isUnread ? 'bg-amber-50/40' : 'bg-white'
                  }`}
                  onClick={() => handleOpenMessage(msg)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#25201D]">{msg.name}</span>
                        {isUnread && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                            NEW
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#6F6761] block mt-0.5">{msg.email}</span>
                    </div>

                    <span className="text-[10px] text-[#6F6761] whitespace-nowrap">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-[#B85C38] block">
                      {msg.subject || 'General Inquiry'}
                    </span>
                    <p className="text-xs text-[#25201D] line-clamp-2 mt-1 leading-relaxed">
                      {msg.message}
                    </p>
                  </div>

                  <div
                    className="flex items-center justify-between pt-2 border-t border-[#E8DED6]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2">
                      <a
                        href={`mailto:${msg.email}?subject=${encodeURIComponent('Re: ' + (msg.subject || 'Customer Inquiry'))}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F7F3EE] text-[#B85C38] border border-[#E8DED6] text-xs font-bold"
                      >
                        <Mail size={12} />
                        Email
                      </a>

                      {waNumber && (
                        <a
                          href={`https://wa.me/${waNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold"
                        >
                          <MessageCircle size={12} />
                          WhatsApp
                        </a>
                      )}

                      {msg.phone && (
                        <a
                          href={`tel:${msg.phone}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F7F3EE] text-[#25201D] border border-[#E8DED6] text-xs font-bold"
                        >
                          <Phone size={12} />
                          Call
                        </a>
                      )}
                    </div>

                    <button
                      onClick={() => setDeleteTarget(msg)}
                      className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-50"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Message Details Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-2xl bg-[#FFFFFF] border border-[#E8DED6] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E8DED6]">
              <div>
                <span className="text-[11px] font-bold text-[#B85C38] uppercase tracking-wider block">
                  Customer Inquiry Detail
                </span>
                <h2 className="text-xl font-extrabold font-heading text-[#25201D] mt-0.5">
                  {selectedMessage.subject || 'General Inquiry'}
                </h2>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-2 rounded-xl bg-[#F7F3EE] text-[#6F6761] hover:text-[#25201D] hover:bg-[#E8DED6] transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Sender Meta Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-[#F7F3EE] border border-[#E8DED6] text-xs">
              <div>
                <span className="text-[#6F6761] block text-[11px]">Sender Name:</span>
                <span className="font-bold text-[#25201D] text-sm block mt-0.5">
                  {selectedMessage.name}
                </span>
              </div>

              <div>
                <span className="text-[#6F6761] block text-[11px]">Email Address:</span>
                <a
                  href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent('Re: ' + (selectedMessage.subject || 'Customer Inquiry'))}`}
                  className="font-bold text-[#B85C38] text-sm hover:underline block mt-0.5"
                >
                  {selectedMessage.email}
                </a>
              </div>

              <div>
                <span className="text-[#6F6761] block text-[11px]">Phone Number:</span>
                {selectedMessage.phone ? (
                  <a
                    href={`tel:${selectedMessage.phone}`}
                    className="font-bold text-[#25201D] text-sm hover:underline block mt-0.5"
                  >
                    {selectedMessage.phone}
                  </a>
                ) : (
                  <span className="font-medium text-[#6F6761] italic text-sm block mt-0.5">
                    Not provided
                  </span>
                )}
              </div>

              <div>
                <span className="text-[#6F6761] block text-[11px]">Received Date & Time:</span>
                <span className="font-bold text-[#25201D] text-sm block mt-0.5">
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Full Message Body */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#6F6761] block mb-2">
                Customer Message
              </span>
              <div className="p-5 rounded-2xl bg-[#FFFDFC] border border-[#E8DED6] text-xs sm:text-sm text-[#25201D] leading-relaxed whitespace-pre-wrap select-text">
                {selectedMessage.message}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E8DED6]">
              <div className="flex flex-wrap items-center gap-2">
                {/* Reply via Email */}
                <a
                  href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent('Re: ' + (selectedMessage.subject || 'Customer Inquiry'))}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#B85C38] text-white text-xs font-bold hover:bg-[#8F432B] shadow-sm transition-all"
                >
                  <Mail size={15} />
                  Reply via Email
                </a>

                {/* WhatsApp */}
                {formatWhatsAppNumber(selectedMessage.phone) && (
                  <a
                    href={`https://wa.me/${formatWhatsAppNumber(selectedMessage.phone)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:brightness-105 shadow-sm transition-all"
                  >
                    <MessageCircle size={15} />
                    WhatsApp
                  </a>
                )}

                {/* Call */}
                {selectedMessage.phone && (
                  <a
                    href={`tel:${selectedMessage.phone}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F7F3EE] text-[#25201D] border border-[#E8DED6] text-xs font-bold hover:bg-[#E8DED6] transition-all"
                  >
                    <Phone size={15} />
                    Call Customer
                  </a>
                )}
              </div>

              <button
                onClick={() => setDeleteTarget(selectedMessage)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors"
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-md bg-[#FFFFFF] border border-[#E8DED6] rounded-3xl p-6 space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 mx-auto">
              <Trash2 size={24} />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-extrabold text-[#25201D]">Delete Customer Message?</h3>
              <p className="text-xs text-[#6F6761] leading-relaxed">
                Are you sure you want to delete this message from{' '}
                <strong className="text-[#25201D]">{deleteTarget.name}</strong>? This action cannot be
                undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>

              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Message'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
