'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    Calendar,
    MessageSquare,
    Clock,
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

    const enquiry = enquiryData?.data;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <DashboardLoader text="Fetching enquiry details..." />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-16">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-gray-400 hover:text-white transition shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5 text-[#E8BF7A]" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-extrabold text-white font-bricolage tracking-tight flex items-center gap-3">
                            <MessageSquare className="w-8 h-8 text-[#E8BF7A]" />
                            Enquiry Details
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-mono px-2.5 py-0.5 bg-[#E8BF7A]/15 text-[#E8BF7A] rounded-full border border-[#E8BF7A]/30 font-bold">
                                #{enquiry?.id?.slice(0, 8)}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">
                                Inbound Client Inquiry Message
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl border border-rose-500/30 text-rose-400 transition text-sm font-bold flex items-center gap-2"
                        title="Delete Enquiry"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Enquiry
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Message Card */}
                    <div className="bg-[#141414] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-[#E8BF7A]/15 flex items-center justify-center text-[#E8BF7A] border border-[#E8BF7A]/30">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-white font-bricolage">
                                    Message Content
                                </h2>
                            </div>
                        </div>
                        <div className="p-8 sm:p-10 space-y-8">
                            <div className="relative p-8 bg-white/5 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                                <span className="absolute top-4 left-4 text-[120px] leading-none text-white/5 font-serif select-none">
                                    “
                                </span>
                                <p className="relative z-10 text-gray-100 leading-relaxed text-lg font-medium font-bricolage tracking-wide">
                                    {enquiry?.message}
                                </p>
                                <span className="absolute bottom-4 right-4 text-[120px] leading-none text-white/5 font-serif select-none translate-y-12">
                                    ”
                                </span>
                            </div>

                            {/* Contact Action Buttons */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <a
                                    href={`mailto:${enquiry?.email}`}
                                    className="flex items-center justify-center gap-3 py-3.5 bg-gradient-to-r from-[#9A7236] to-[#E8BF7A] text-[#1a1a1a] rounded-xl font-bold transition shadow-lg hover:brightness-110"
                                >
                                    <Mail className="w-5 h-5" />
                                    <span>Reply via Email</span>
                                </a>
                                <a
                                    href={`tel:${enquiry?.phone_number}`}
                                    className="flex items-center justify-center gap-3 py-3.5 bg-white/5 hover:bg-white/10 text-gray-200 rounded-xl font-bold border border-white/10 transition"
                                >
                                    <Phone className="w-5 h-5 text-[#E8BF7A]" />
                                    <span>Call {enquiry?.name?.split(' ')[0]}</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: User Info & Metadata */}
                <div className="space-y-6">
                    {/* Submitter Card */}
                    <div className="bg-[#141414] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                        <div className="px-6 py-5 border-b border-white/10 bg-white/5 flex items-center justify-between">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                Contact Profile
                            </h3>
                            <div className="w-2 h-2 rounded-full bg-[#E8BF7A]"></div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#9A7236] to-[#E8BF7A] flex items-center justify-center text-[#1a1a1a] text-xl font-extrabold font-bricolage">
                                    {enquiry?.name?.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-white text-lg font-bold font-bricolage leading-none mb-1">
                                        {enquiry?.name}
                                    </h4>
                                    <span className="px-2 py-0.5 bg-[#E8BF7A]/15 text-[#E8BF7A] text-[10px] font-bold uppercase tracking-wider rounded border border-[#E8BF7A]/30">
                                        Client Inquiry
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <ContactDetail
                                    icon={<Mail className="w-4 h-4 text-[#E8BF7A]" />}
                                    label="Email Address"
                                    value={enquiry?.email}
                                    isLink
                                    href={`mailto:${enquiry?.email}`}
                                />
                                <ContactDetail
                                    icon={<Phone className="w-4 h-4 text-[#E8BF7A]" />}
                                    label="Phone Number"
                                    value={
                                        enquiry?.phone_number
                                            ? `${enquiry?.phone_country_code || ''} ${enquiry?.phone_number}`
                                            : 'N/A'
                                    }
                                    isLink={!!enquiry?.phone_number}
                                    href={`tel:${enquiry?.phone_number}`}
                                />
                                <ContactDetail
                                    icon={<MapPin className="w-4 h-4 text-[#E8BF7A]" />}
                                    label="Location"
                                    value={enquiry?.location || 'N/A'}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Meta Card */}
                    <div className="bg-[#141414] rounded-3xl border border-white/10 p-6 space-y-4 shadow-2xl">
                        <div className="flex items-center justify-between py-2 border-b border-white/10">
                            <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                                <Clock className="w-4 h-4 text-[#E8BF7A]" />
                                <span>Submitted At</span>
                            </div>
                            <span className="text-xs text-white font-bold font-mono">
                                {new Date(enquiry?.created_at).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                                <Calendar className="w-4 h-4 text-[#E8BF7A]" />
                                <span>Date Received</span>
                            </div>
                            <span className="text-xs text-white font-bold">
                                {new Date(enquiry?.created_at).toLocaleDateString(undefined, {
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

function ContactDetail({ icon, label, value, isLink, href }: any) {
    return (
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">
                    {label}
                </p>
                {isLink ? (
                    <a
                        href={href}
                        className="text-xs text-white hover:text-[#E8BF7A] transition truncate block font-semibold"
                    >
                        {value}
                    </a>
                ) : (
                    <p className="text-xs text-white truncate font-semibold">{value}</p>
                )}
            </div>
        </div>
    );
}
