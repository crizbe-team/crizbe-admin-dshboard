'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Mail, Phone, Eye, Trash2, RefreshCw, MessageCircle, Gift, Calendar } from 'lucide-react';
import { useFetchEnquiries, useDeleteEnquiry } from '@/queries/use-contact';
import DebouncedSearch from '@/components/ui/DebouncedSearch';
import Pagination from '@/components/ui/Pagination';
import DashboardLoader from '@/components/ui/DashboardLoader';
import { toast } from '@/components/ui/Toast';
import EnquiryDeleteModal from '@/components/Modals/EnquiryDeleteModal';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const itemVariants: Variants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
};

export default function PreOrdersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const {
        data: enquiriesData,
        isLoading,
        isRefetching,
        refetch,
    } = useFetchEnquiries({
        q: searchQuery,
        page: currentPage,
        enquiry_type: 'PRE_ORDER',
    });

    const { mutateAsync: deleteEnquiry, isPending: isDeleting } = useDeleteEnquiry();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [enquiryToDelete, setEnquiryToDelete] = useState<any | null>(null);

    const handleDeleteClick = (enquiry: any) => {
        setEnquiryToDelete(enquiry);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteEnquiry = async () => {
        if (enquiryToDelete) {
            try {
                await deleteEnquiry(enquiryToDelete.id);
                toast.success('Pre-order inquiry deleted successfully');
                refetch();
                setIsDeleteModalOpen(false);
                setEnquiryToDelete(null);
            } catch {
                toast.error('Failed to delete pre-order inquiry');
            }
        }
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setEnquiryToDelete(null);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const enquiries = enquiriesData?.data || [];

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 pb-16 max-w-7xl mx-auto"
        >
            {/* Page Header */}
            <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <div className="space-y-1">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-bricolage tracking-tight leading-none flex items-center gap-3">
                        <Gift className="w-9 h-9 text-[#E8BF7A]" />
                        Pre-Order Inquiries
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base font-medium">
                        View and manage advance pre-order requests submitted by customers.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => refetch()}
                        disabled={isRefetching}
                        className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 text-sm font-semibold transition flex items-center gap-2"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
            </motion.div>

            {/* Enquiries Table */}
            <motion.div
                variants={itemVariants}
                className="bg-[#141414] rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
            >
                <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between flex-wrap gap-4">
                    <h2 className="text-lg font-bold text-white">Pre-Order Requests</h2>
                    <div className="flex items-center gap-4">
                        <DebouncedSearch
                            placeholder="Search by name, email or phone..."
                            onSearch={setSearchQuery}
                            className="w-80"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="p-12 border-t border-white/5">
                            <DashboardLoader text="Loading pre-orders..." />
                        </div>
                    ) : enquiries.length === 0 ? (
                        <div className="p-12 text-center text-gray-400 font-medium">
                            No pre-order inquiries received yet.
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm text-gray-300">
                            <thead className="bg-white/5 text-gray-400 uppercase text-[11px] font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Client Name</th>
                                    <th className="px-6 py-4">Contact Info</th>
                                    <th className="px-6 py-4">Target Date</th>
                                    <th className="px-6 py-4">Date Submitted</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-medium">
                                {enquiries.map((enquiry: any) => {
                                    const rawPhone = (enquiry.phone_number || '').replace(/\D/g, '');
                                    const whatsappMsg = encodeURIComponent(
                                        `Hi ${enquiry.name}, thank you for reaching out to Crizbe! We would love to assist you with your pre-order request.`
                                    );
                                    const whatsappUrl = `https://wa.me/${rawPhone}?text=${whatsappMsg}`;

                                    return (
                                        <tr
                                            key={enquiry.id}
                                            className="hover:bg-white/[0.02] transition"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-[#E8BF7A]/20 border border-[#E8BF7A] flex items-center justify-center text-[#E8BF7A]">
                                                        <Gift className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-white font-bold">
                                                            {enquiry.name}
                                                        </span>
                                                        <span className="text-xs text-gray-400 font-mono">
                                                            ID: #{enquiry.id.slice(0, 6)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    {enquiry.email && (
                                                        <div className="flex items-center gap-1.5 text-xs text-gray-300 font-mono">
                                                            <Mail className="w-3.5 h-3.5 text-[#E8BF7A]" />
                                                            {enquiry.email}
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
                                                        <Phone className="w-3.5 h-3.5 text-gray-500" />
                                                        {enquiry.phone_number
                                                            ? `${enquiry.phone_country_code || '+91'} ${enquiry.phone_number}`
                                                            : 'N/A'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {enquiry.target_date ? (
                                                    <span className="text-[#E8BF7A] font-bold flex items-center gap-1 font-mono text-xs">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {enquiry.target_date}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-500 italic text-xs">Not specified</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-gray-400 text-sm">
                                                {enquiry.created_at
                                                    ? new Date(enquiry.created_at).toLocaleDateString()
                                                    : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    {rawPhone && (
                                                        <a
                                                            href={whatsappUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition"
                                                            title="Reply on WhatsApp"
                                                        >
                                                            <MessageCircle className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                    <Link
                                                        href={`/bd6b-6ced/dashboard/enquiries/${enquiry.id}`}
                                                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-[#E8BF7A] transition"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4 text-[#E8BF7A]" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteClick(enquiry)}
                                                        disabled={isDeleting}
                                                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition disabled:opacity-50"
                                                        title="Delete Inquiry"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {enquiriesData?.pagination && enquiriesData.pagination.total_pages > 1 && (
                    <div className="p-4 border-t border-white/10">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={enquiriesData.pagination.total_pages}
                            onPageChange={setCurrentPage}
                            hasNext={enquiriesData.pagination.has_next}
                            hasPrevious={enquiriesData.pagination.has_previous}
                        />
                    </div>
                )}
            </motion.div>

            {/* Delete Confirmation Modal */}
            <EnquiryDeleteModal
                isDeleteModalOpen={isDeleteModalOpen}
                enquiryToDelete={enquiryToDelete}
                cancelDelete={cancelDelete}
                confirmDeleteEnquiry={confirmDeleteEnquiry}
                isDeleting={isDeleting}
            />
        </motion.div>
    );
}
