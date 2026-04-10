'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Mail, Phone, MapPin, Eye, Trash2, Search } from 'lucide-react';
import { useFetchEnquiries, useDeleteEnquiry } from '@/queries/use-contact';
import DebouncedSearch from '@/components/ui/DebouncedSearch';
import Pagination from '@/components/ui/Pagination';
import DashboardLoader from '@/components/ui/DashboardLoader';
import { toast } from '@/components/ui/Toast';
import EnquiryDeleteModal from '@/components/Modals/EnquiryDeleteModal';

export default function EnquiriesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const {
        data: enquiriesData,
        isLoading,
        refetch,
    } = useFetchEnquiries({
        q: searchQuery,
        page: currentPage,
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
                toast.success('Enquiry deleted successfully');
                refetch();
                setIsDeleteModalOpen(false);
                setEnquiryToDelete(null);
            } catch (error) {
                toast.error('Failed to delete enquiry');
            }
        }
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setEnquiryToDelete(null);
    };

    // Reset page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const enquiries = enquiriesData?.data || [];

    return (
        <div className="space-y-6 relative min-h-screen pb-20">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-100 mb-2 font-bricolage">
                    Contact Enquiries
                </h1>
                <p className="text-gray-400">
                    View and manage messages submitted via the contact form.
                </p>
            </div>

            {/* Enquiries Table */}
            <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
                <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between flex-wrap gap-4">
                    <h2 className="text-xl font-semibold text-gray-100">Submitted Details</h2>
                    <div className="flex items-center gap-4">
                        <DebouncedSearch
                            placeholder="Search by name, email or location..."
                            onSearch={setSearchQuery}
                            className="w-72"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="p-20">
                            <DashboardLoader text="Loading enquiries..." />
                        </div>
                    ) : enquiries.length === 0 ? (
                        <div className="p-20 text-center text-gray-500">
                            No enquiries found yet.
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[#252525]">
                                    <th className="text-left p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">
                                        USER
                                    </th>
                                    <th className="text-left p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">
                                        CONTACT INFO
                                    </th>
                                    <th className="text-left p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">
                                        LOCATION
                                    </th>
                                    <th className="text-left p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">
                                        DATE
                                    </th>
                                    <th className="text-left p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">
                                        ACTIONS
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2a2a2a]">
                                {enquiries.map((enquiry: any) => (
                                    <tr
                                        key={enquiry.id}
                                        className="hover:bg-[#212121] transition-colors group"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-gray-100 font-medium">
                                                        {enquiry.name}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        Submission ID: #{enquiry.id.slice(0, 6)}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                                    <Mail className="w-3 h-3" />
                                                    {enquiry.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                                    <Phone className="w-3 h-3" />
                                                    {enquiry.phone_number
                                                        ? `${enquiry.phone_country_code} ${enquiry.phone_number}`
                                                        : 'N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                                <MapPin className="w-4 h-4 text-gray-500" />
                                                {enquiry.location}
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-400 text-sm">
                                            {enquiry.created_at
                                                ? new Date(enquiry.created_at).toLocaleDateString()
                                                : 'N/A'}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center space-x-2">
                                                <Link
                                                    href={`/bd6b-6ced/dashboard/enquiries/${enquiry.id}`}
                                                    className="p-2 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg transition-all group-hover:scale-110"
                                                    title="View Full Message"
                                                >
                                                    <Eye className="w-4 h-4 text-purple-400" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteClick(enquiry)}
                                                    disabled={isDeleting}
                                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all group-hover:scale-110 disabled:opacity-50"
                                                    title="Delete Enquiry"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-400" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {enquiriesData?.pagination && enquiriesData.pagination.total_pages > 1 && (
                    <div className="p-4 border-t border-[#2a2a2a]">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={enquiriesData.pagination.total_pages}
                            onPageChange={setCurrentPage}
                            hasNext={enquiriesData.pagination.has_next}
                            hasPrevious={enquiriesData.pagination.has_previous}
                        />
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <EnquiryDeleteModal
                isDeleteModalOpen={isDeleteModalOpen}
                enquiryToDelete={enquiryToDelete}
                cancelDelete={cancelDelete}
                confirmDeleteEnquiry={confirmDeleteEnquiry}
                isDeleting={isDeleting}
            />
        </div>
    );
}
