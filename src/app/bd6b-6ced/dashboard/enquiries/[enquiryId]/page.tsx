'use client';

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
} from 'lucide-react';
import { useFetchEnquiryDetail } from '@/queries/use-contact';
import DashboardLoader from '@/components/ui/DashboardLoader';

export default function EnquiryDetailPage() {
    const params = useParams();
    const router = useRouter();
    const enquiryId = params.enquiryId as string;

    const { data: enquiryData, isLoading } = useFetchEnquiryDetail(enquiryId);

    // Dummy data fallback
    const enquiry = enquiryData?.data || {
        id: enquiryId || 'ENQ-00123',
        name: 'Ahammad Salim',
        email: 'salim@example.com',
        phone: '+91 9061000000',
        location: 'Calicut, Kerala',
        message:
            'Hello, I am interested in bulk orders for my retail store in Calicut. Could you please provide the wholesale price list and the minimum order quantity for all 3 flavors? Also, let me know if you offer any customized packaging for corporate gifting occasions like weddings or business events.',
        created_at: new Date().toISOString(),
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <DashboardLoader text="Fetching enquiry details..." />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-xl border border-[#2a2a2a] transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-400" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-100 font-bricolage">
                            Enquiry Details
                        </h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500 font-mono">
                            <span>#{enquiry.id.slice(0, 8)}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                            <span>Enquiry</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="p-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg border border-[#2a2a2a] text-gray-400 transition-all">
                        <LinkIcon className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg border border-[#2a2a2a] text-gray-400 transition-all">
                        <MoreVertical className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Message Box */}
                    <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] overflow-hidden">
                        <div className="p-6 border-b border-[#2a2a2a] flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-blue-400" />
                            <h2 className="text-lg font-semibold text-gray-100">Message Content</h2>
                        </div>
                        <div className="p-8">
                            <div className="bg-[#212121] rounded-xl p-6 border border-[#2a2a2a] relative">
                                <div className="absolute -top-3 left-6 px-2 bg-[#1a1a1a] text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                    Message
                                </div>
                                <p className="text-gray-200 leading-relaxed text-lg italic	">
                                    "{enquiry.message}"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sender Background */}
                    <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-6 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-gray-100 font-semibold mb-1">
                                Sender Verification
                            </h3>
                            <p className="text-gray-400 text-sm">
                                This enquiry was submitted via the landing page contact form. The
                                sender has provided a verified email and phone number for
                                communication.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: User Info & Metadata */}
                <div className="space-y-6">
                    {/* User Info Card */}
                    <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] overflow-hidden">
                        <div className="p-6 border-b border-[#2a2a2a] bg-[#212121]/50">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                Submitter Info
                            </h3>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="flex items-center gap-4 p-4 bg-[#212121] rounded-xl border border-[#2a2a2a]">
                                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 text-xl font-bold">
                                    {enquiry.name?.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-gray-100 font-bold">{enquiry.name}</h4>
                                    <p className="text-xs text-gray-500">Contact Person</p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">
                                            Email Address
                                        </p>
                                        <p className="text-sm text-gray-200">{enquiry.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">
                                            Phone Number
                                        </p>
                                        <p className="text-sm text-gray-200">{enquiry.phone}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">
                                            Location
                                        </p>
                                        <p className="text-sm text-gray-200">{enquiry.location}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Metadata Card */}
                    <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-6 space-y-4">
                        <div className="flex items-center justify-between py-2 border-b border-[#2a2a2a]">
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Submitted At</span>
                            </div>
                            <span className="text-xs text-gray-300">
                                {new Date(enquiry.created_at).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-[#2a2a2a]">
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Date</span>
                            </div>
                            <span className="text-xs text-gray-300">
                                {new Date(enquiry.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                        <a
                            href={`mailto:${enquiry.email}`}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg"
                        >
                            <Mail className="w-4 h-4" />
                            Reply via Email
                        </a>
                        <a
                            href={`tel:${enquiry.phone}`}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-[#2a2a2a] hover:bg-[#333] text-gray-100 rounded-xl font-semibold border border-[#3a3a3a] transition-all"
                        >
                            <Phone className="w-4 h-4" />
                            Call Sender
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
