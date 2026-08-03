'use client';

import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import {
    BookOpen,
    Search,
    Edit2,
    Trash2,
    Plus,
    CheckCircle,
    Clock,
    FileText,
    Eye,
    RefreshCw,
    Filter,
} from 'lucide-react';
import { useFetchAdminBlogs, useToggleBlogStatus, useDeleteBlog } from '@/queries/use-blogs';
import { BlogItem } from '@/types/blog';
import BlogFormModal from './_components/BlogFormModal';
import DashboardConfirmationModal from '@/components/Modals/DashboardConfirmationModal';
import DashboardLoader from '@/components/ui/DashboardLoader';
import DebouncedSearch from '@/components/ui/DebouncedSearch';

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

export default function AdminBlogsPage() {
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editItem, setEditItem] = useState<BlogItem | null>(null);
    const [deleteItem, setDeleteItem] = useState<BlogItem | null>(null);

    const {
        data: blogsRes,
        isLoading,
        isRefetching,
        refetch,
    } = useFetchAdminBlogs({
        status: selectedStatus === 'all' ? undefined : selectedStatus,
        q: searchQuery || undefined,
    });

    const toggleStatusMutation = useToggleBlogStatus();
    const deleteMutation = useDeleteBlog();

    const blogs: BlogItem[] = blogsRes?.data || [];

    const totalCount = blogs.length;
    const publishedCount = blogs.filter((b: BlogItem) => b.status === 'published').length;
    const draftCount = blogs.filter((b: BlogItem) => b.status === 'draft').length;

    const stats = [
        {
            title: 'Total Articles',
            value: totalCount,
            icon: BookOpen,
            color: 'text-[#E8BF7A]',
        },
        {
            title: 'Published Live',
            value: publishedCount,
            icon: CheckCircle,
            color: 'text-emerald-400',
        },
        {
            title: 'Draft Articles',
            value: draftCount,
            icon: Clock,
            color: 'text-amber-300',
        },
    ];

    const handleCreateNew = () => {
        setEditItem(null);
        setIsFormOpen(true);
    };

    const handleEdit = (item: BlogItem) => {
        setEditItem(item);
        setIsFormOpen(true);
    };

    const handleToggleStatus = (item: BlogItem) => {
        const nextStatus = item.status === 'published' ? 'draft' : 'published';
        toggleStatusMutation.mutate({ id: item.id, status: nextStatus });
    };

    const confirmDelete = async () => {
        if (deleteItem) {
            try {
                await deleteMutation.mutateAsync(deleteItem.id);
                setDeleteItem(null);
            } catch (err) {
                console.error('Failed to delete blog article:', err);
            }
        }
    };

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
                        <BookOpen className="w-9 h-9 text-[#E8BF7A]" />
                        Blog & Article CMS
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base font-medium">
                        Manage luxury gourmet stories, flavor guides, drafts, and published journal
                        articles.
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

                    <button
                        onClick={handleCreateNew}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#9A7236] to-[#E8BF7A] text-[#1a1a1a] font-bold text-sm hover:brightness-110 shadow-lg transition flex items-center gap-2 cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        Create Article
                    </button>
                </div>
            </motion.div>

            {/* Statistics Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.title}
                            className="bg-[#141414] rounded-3xl p-6 border border-white/10 transition-all hover:border-[#E8BF7A]/30 group relative overflow-hidden shadow-xl"
                        >
                            <div className="flex flex-col h-full justify-between gap-4">
                                <div className="flex items-center justify-between">
                                    <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-[#E8BF7A]">
                                        <Icon className={`w-5 h-5 ${stat.color}`} />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                                        {stat.title}
                                    </p>
                                    <p className="text-3xl font-extrabold text-white font-bricolage tracking-tight">
                                        {stat.value}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </motion.div>

            {/* Search & Filter Controls */}
            <motion.div
                variants={itemVariants}
                className="bg-[#141414] rounded-3xl p-5 border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
                {/* Search */}
                <div className="w-full md:w-80">
                    <DebouncedSearch
                        placeholder="Search by title or excerpt..."
                        onSearch={(val) => setSearchQuery(val)}
                    />
                </div>

                {/* Status Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                    {['all', 'published', 'draft'].map((st) => (
                        <button
                            key={st}
                            onClick={() => setSelectedStatus(st)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                                selectedStatus === st
                                    ? 'bg-[#E8BF7A] text-[#141414] shadow-md font-extrabold'
                                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                            }`}
                        >
                            {st === 'all' ? 'All Articles' : st}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Main Articles Table */}
            <motion.div
                variants={itemVariants}
                className="bg-[#141414] rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
            >
                {isLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center">
                        <DashboardLoader />
                        <p className="text-sm font-medium text-gray-400 mt-4">
                            Fetching articles...
                        </p>
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="p-16 text-center text-gray-400 space-y-4">
                        <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#E8BF7A]">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-white font-bricolage">
                                No blog articles found
                            </p>
                            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                                No articles match your current filter or search criteria. Click
                                &quot;Create Article&quot; to publish a new story.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-300">
                            <thead className="bg-white/[0.02] border-b border-white/10 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Article</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Author</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Read Time</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {blogs.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-white/[0.02] transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                                                    {item.cover_image_url || item.cover_image ? (
                                                        <img
                                                            src={
                                                                item.cover_image_url ||
                                                                item.cover_image ||
                                                                ''
                                                            }
                                                            alt={item.title}
                                                            className="w-full h-full object-contain p-1"
                                                        />
                                                    ) : (
                                                        <FileText className="w-5 h-5 text-gray-500" />
                                                    )}
                                                </div>
                                                <div className="max-w-md">
                                                    <h4 className="font-bold text-white group-hover:text-[#E8BF7A] transition-colors line-clamp-1">
                                                        {item.title}
                                                    </h4>
                                                    <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                                                        {item.excerpt}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-gray-300">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-medium text-gray-300">
                                            {item.author_name || item.author?.name || 'Crizbe Team'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleStatus(item)}
                                                className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                                                    item.status === 'published'
                                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                                                        : 'bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20'
                                                }`}
                                                title="Click to toggle publishing status"
                                            >
                                                {item.status === 'published'
                                                    ? '🚀 Published'
                                                    : '📝 Draft'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-400 font-mono">
                                            {item.read_time}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {item.status === 'published' && (
                                                    <a
                                                        href={`/blog/${item.slug}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition"
                                                        title="View Live Article"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </a>
                                                )}
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="p-2 text-gray-400 hover:text-[#E8BF7A] hover:bg-white/5 rounded-xl transition cursor-pointer"
                                                    title="Edit Article"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteItem(item)}
                                                    className="p-2 text-gray-400 hover:text-rose-400 hover:bg-white/5 rounded-xl transition cursor-pointer"
                                                    title="Delete Article"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>

            {/* Create / Edit Form Modal */}
            <BlogFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                initialData={editItem}
            />

            {/* Delete Confirmation Modal */}
            <DashboardConfirmationModal
                open={Boolean(deleteItem)}
                onClose={() => setDeleteItem(null)}
                onConfirm={confirmDelete}
                title="Delete Blog Article?"
                description={`Are you sure you want to permanently delete "${deleteItem?.title || 'this article'}"? This action cannot be undone.`}
                confirmText="Delete Article"
                isPending={deleteMutation.isPending}
            />
        </motion.div>
    );
}
