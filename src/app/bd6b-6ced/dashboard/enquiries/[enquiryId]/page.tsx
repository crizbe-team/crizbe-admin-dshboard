'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    MessageSquare,
    Clock,
    Shield,
    MoreVertical,
    Link as LinkIcon,
    Trash2,
} from 'lucide-react';
import { useFetchEnquiryDetail, useDeleteEnquiry } from '@/queries/use-contact';
import DashboardLoader from '@/components/ui/DashboardLoader';
import { toast } from '@/components/ui/Toast';
import EnquiryDeleteModal from '@/components/Modals/EnquiryDeleteModal';

export default function EnquiryDetailPage() {
    const params = useParams();
    const router = useRouter();
    const enquiryId = params.enquiryId as string;

    const { data: enquiryData, isLoading } = useFetchEnquiryDetail(enquiryId);
    const { mutateAsync: deleteEnquiry, isPending: isDeleting } = useDeleteEnquiry();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDelete = () => {
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteEnquiry = async () => {
        try {
            await deleteEnquiry(enquiryId);
            toast.success('Enquiry deleted successfully');
            router.push('/bd6b-6ced/dashboard/enquiries');
        } catch (error) {
            toast.error('Failed to delete enquiry');
        }
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
    };

    // Dummy data fallback
    const enquiry = enquiryData?.data;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <DashboardLoader text="Fetching enquiry details..." />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => router.back()}
                        className="group p-2.5 bg-[#1a1a1a] hover:bg-[#252525] rounded-xl border border-[#2a2a2a] transition-all hover:scale-105 active:scale-95"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-100 to-gray-400 font-bricolage">
                            Enquiry Details
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-mono px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
                                #{enquiry.id.slice(0, 8)}
                            </span>
                            <span className="text-xs text-gray-500 font-medium">
                                Inbound Message
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="p-2.5 bg-[#1a1a1a] hover:bg-red-500/10 rounded-xl border border-[#2a2a2a] text-red-400 transition-all disabled:opacity-50 hover:border-red-500/30"
                        title="Delete Enquiry"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Message Card */}
                    <div className="group bg-[#1a1a1a] rounded-[2rem] border border-[#2a2a2a] overflow-hidden transition-all hover:border-blue-500/20 shadow-xl">
                        <div className="p-8 border-b border-[#2a2a2a] flex items-center justify-between bg-linear-to-r from-[#1e1e1e] to-transparent">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-inner">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-100 font-bricolage">
                                    Message Content
                                </h2>
                            </div>
                        </div>
                        <div className="p-8 sm:p-10 space-y-8">
                            <div className="relative p-8 bg-[#212121] rounded-3xl border border-[#2a2a2a] shadow-2xl overflow-hidden group-hover:bg-[#252525] transition-all duration-500">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px] rounded-full"></div>
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 blur-[60px] rounded-full"></div>

                                <span className="absolute top-4 left-4 text-[120px] leading-none text-white/5 font-serif select-none">
                                    “
                                </span>
                                <p className="relative z-10 text-gray-100 leading-relaxed text-xl font-medium font-bricolage tracking-wide">
                                    {enquiry.message}
                                </p>
                                <span className="absolute bottom-4 right-4 text-[120px] leading-none text-white/5 font-serif select-none translate-y-12">
                                    ”
                                </span>
                            </div>

                            {/* Contact Action Buttons - Integrated */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <a
                                    href={`mailto:${enquiry.email}`}
                                    className="group flex items-center justify-center gap-3 py-4 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-500/10 hover:shadow-blue-500/25 active:scale-[0.98]"
                                >
                                    <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span>Reply via Email</span>
                                </a>
                                <a
                                    href={`tel:${enquiry.phone_number}`}
                                    className="group flex items-center justify-center gap-3 py-4 bg-[#2a2a2a] hover:bg-[#333] text-gray-100 rounded-2xl font-bold border border-[#3a3a3a] transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <Phone className="w-5 h-5 group-hover:scale-110 transition-transform text-blue-400" />
                                    <span>Call {enquiry.name?.split(' ')[0]}</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: User Info & Metadata */}
                <div className="space-y-6">
                    {/* Submitter Card */}
                    <div className="bg-[#1a1a1a] rounded-[2rem] border border-[#2a2a2a] overflow-hidden shadow-xl">
                        <div className="px-6 py-5 border-b border-[#2a2a2a] bg-[#212121]/50 flex items-center justify-between">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                Contact Information
                            </h3>
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-4 p-5 bg-linear-to-br from-[#212121] to-[#1a1a1a] rounded-2xl border border-[#2a2a2a]">
                                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-500/10 to-blue-400/5 flex items-center justify-center text-blue-400 border border-blue-500/20 text-2xl font-bold shadow-inner">
                                    {enquiry.name?.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-gray-100 text-lg font-bold font-bricolage leading-none mb-1.5">
                                        {enquiry.name}
                                    </h4>
                                    <span className="px-2 py-0.5 bg-gray-800 text-gray-500 text-[10px] font-bold uppercase tracking-wider rounded border border-gray-700">
                                        Submitter
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <ContactDetail
                                    icon={<Mail className="w-4 h-4" />}
                                    label="Email Address"
                                    value={enquiry.email}
                                    isLink
                                    href={`mailto:${enquiry.email}`}
                                />
                                <ContactDetail
                                    icon={<Phone className="w-4 h-4" />}
                                    label="Phone Number"
                                    value={
                                        enquiry.phone_number
                                            ? `${enquiry.phone_country_code} ${enquiry.phone_number}`
                                            : 'N/A'
                                    }
                                    isLink={!!enquiry.phone_number}
                                    href={`tel:${enquiry.phone_number}`}
                                />
                                <ContactDetail
                                    icon={<MapPin className="w-4 h-4" />}
                                    label="Location"
                                    value={enquiry.location}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Meta Card */}
                    <div className="bg-[#1a1a1a] rounded-[2rem] border border-[#2a2a2a] p-6 space-y-4">
                        <div className="flex items-center justify-between py-2 border-b border-[#2a2a2a]">
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                <Clock className="w-4 h-4 text-blue-500/50" />
                                <span>Submitted At</span>
                            </div>
                            <span className="text-sm text-gray-200 font-medium">
                                {new Date(enquiry.created_at).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                <Calendar className="w-4 h-4 text-blue-500/50" />
                                <span>Date</span>
                            </div>
                            <span className="text-sm text-gray-200 font-medium">
                                {new Date(enquiry.created_at).toLocaleDateString(undefined, {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <EnquiryDeleteModal
                isDeleteModalOpen={isDeleteModalOpen}
                enquiryToDelete={enquiry}
                cancelDelete={cancelDelete}
                confirmDeleteEnquiry={confirmDeleteEnquiry}
                isDeleting={isDeleting}
            />
        </div>
    );
}

// Helper Components
function ContactDetail({ icon, label, value, isLink, href }: any) {
    return (
        <div className="group/item flex items-center gap-4 p-3 hover:bg-[#212121] rounded-xl transition-all border border-transparent hover:border-[#2a2a2a]">
            <div className="w-9 h-9 rounded-xl bg-[#212121] group-hover/item:bg-[#2a2a2a] flex items-center justify-center text-gray-500 group-hover/item:text-blue-400 transition-all shadow-sm">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight mb-0.5">
                    {label}
                </p>
                {isLink ? (
                    <a
                        href={href}
                        className="text-sm text-gray-200 hover:text-blue-400 transition-colors truncate block font-medium"
                    >
                        {value}
                    </a>
                ) : (
                    <p className="text-sm text-gray-200 truncate font-medium">{value}</p>
                )}
            </div>
        </div>
    );
}
