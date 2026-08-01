'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Plus, Trash2, Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { BlogItem } from '@/types/blog';
import { useCreateBlog, useUpdateBlog } from '@/queries/use-blogs';

interface BlogFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: BlogItem | null;
}

export default function BlogFormModal({ isOpen, onClose, initialData }: BlogFormModalProps) {
    const isEdit = Boolean(initialData?.id);
    const createMutation = useCreateBlog();
    const updateMutation = useUpdateBlog();

    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('Gourmet Chocolate');
    const [authorName, setAuthorName] = useState('Crizbe Culinary Team');
    const [authorRole, setAuthorRole] = useState('Master Chocolatier');
    const [readTime, setReadTime] = useState('4 min read');
    const [status, setStatus] = useState<'draft' | 'published'>('draft');

    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);

    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);

    const [keywordInput, setKeywordInput] = useState('');
    const [keywords, setKeywords] = useState<string[]>([]);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setSlug(initialData.slug || '');
            setExcerpt(initialData.excerpt || '');
            setContent(initialData.content || '');
            setCategory(initialData.category || 'Gourmet Chocolate');
            setAuthorName(initialData.author_name || initialData.author?.name || 'Crizbe Culinary Team');
            setAuthorRole(initialData.author_role || initialData.author?.role || 'Master Chocolatier');
            setReadTime(initialData.read_time || '4 min read');
            setStatus(initialData.status || 'draft');
            setTags(initialData.tags || []);
            setKeywords(initialData.keywords || []);
            setCoverImagePreview(initialData.cover_image_url || initialData.cover_image || null);
            setCoverImage(null);
        } else {
            setTitle('');
            setSlug('');
            setExcerpt('');
            setContent('');
            setCategory('Gourmet Chocolate');
            setAuthorName('Crizbe Culinary Team');
            setAuthorRole('Master Chocolatier');
            setReadTime('4 min read');
            setStatus('draft');
            setTags(['Belgian Chocolate', 'Crunch Sticks']);
            setKeywords(['luxury chocolate', 'gourmet snacks']);
            setCoverImage(null);
            setCoverImagePreview(null);
        }
    }, [initialData, isOpen]);

    const handleTitleChange = (val: string) => {
        setTitle(val);
        if (!isEdit) {
            const generatedSlug = val
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-');
            setSlug(generatedSlug);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverImage(file);
            setCoverImagePreview(URL.createObjectURL(file));
        }
    };

    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((t) => t !== tagToRemove));
    };

    const addKeyword = () => {
        if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
            setKeywords([...keywords, keywordInput.trim()]);
            setKeywordInput('');
        }
    };

    const removeKeyword = (kwToRemove: string) => {
        setKeywords(keywords.filter((k) => k !== kwToRemove));
    };

    // Rich Text Formatting Helper
    const insertFormat = (prefix: string, suffix: string = '') => {
        if (!textareaRef.current) return;
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end) || 'Sample text';
        const replacement = `${prefix}${selectedText}${suffix}`;

        const newContent = content.substring(0, start) + replacement + content.substring(end);
        setContent(newContent);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
        }, 50);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('slug', slug);
        formData.append('excerpt', excerpt);
        formData.append('content', content);
        formData.append('category', category);
        formData.append('author_name', authorName);
        formData.append('author_role', authorRole);
        formData.append('read_time', readTime);
        formData.append('status', status);
        formData.append('tags', JSON.stringify(tags));
        formData.append('keywords', JSON.stringify(keywords));

        if (coverImage) {
            formData.append('cover_image', coverImage);
        }

        if (isEdit && initialData?.id) {
            updateMutation.mutate(
                { id: initialData.id, formData },
                {
                    onSuccess: () => onClose(),
                }
            );
        } else {
            createMutation.mutate(formData, {
                onSuccess: () => onClose(),
            });
        }
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-4xl bg-[#141414] border border-[#E8BF7A]/30 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col my-auto">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-[#262626] flex items-center justify-between bg-[#1a1a1a]">
                    <div>
                        <h2 className="text-xl font-bold font-bricolage text-white">
                            {isEdit ? 'Edit Blog Article' : 'Create New Blog Article'}
                        </h2>
                        <p className="text-xs text-gray-400">
                            Manage rich content, publishing status (Draft/Published), cover image, and SEO metadata.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Form Body */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
                    {/* Status Pill Toggle */}
                    <div className="p-4 bg-[#1a1a1a] rounded-2xl border border-[#262626] flex items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold text-gray-400 block uppercase tracking-wider">
                                Publishing Status
                            </span>
                            <p className="text-xs text-gray-400">
                                {status === 'published'
                                    ? '🟢 Article will be live on public website'
                                    : '🟡 Article is saved as Draft (Hidden from user website)'}
                            </p>
                        </div>

                        <div className="flex bg-[#141414] p-1 rounded-xl border border-[#333]">
                            <button
                                type="button"
                                onClick={() => setStatus('draft')}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    status === 'draft'
                                        ? 'bg-[#333] text-amber-300 shadow-sm'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                📝 Draft
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatus('published')}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    status === 'published'
                                        ? 'bg-gradient-to-r from-[#9A7236] to-[#E8BF7A] text-[#141414] shadow-sm'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                🚀 Published
                            </button>
                        </div>
                    </div>

                    {/* Title & Slug */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                Article Title <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                placeholder="e.g. The Art of Belgian Chocolate Crunch Sticks"
                                className="w-full px-4 py-2.5 bg-[#1e1e1e] border border-[#333] rounded-xl text-white text-sm focus:border-[#E8BF7A] focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                URL Slug (Auto-generated)
                            </label>
                            <input
                                type="text"
                                required
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="art-of-belgian-chocolate-crunch-sticks"
                                className="w-full px-4 py-2.5 bg-[#1e1e1e] border border-[#333] rounded-xl text-gray-300 text-sm focus:border-[#E8BF7A] focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Category, Read Time, Author Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-2.5 bg-[#1e1e1e] border border-[#333] rounded-xl text-white text-sm focus:border-[#E8BF7A] focus:outline-none"
                            >
                                <option value="Gourmet Chocolate">Gourmet Chocolate</option>
                                <option value="Flavor Science">Flavor Science</option>
                                <option value="Lifestyle & Trends">Lifestyle & Trends</option>
                                <option value="Recipes & Pairings">Recipes & Pairings</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Read Time</label>
                            <input
                                type="text"
                                value={readTime}
                                onChange={(e) => setReadTime(e.target.value)}
                                placeholder="e.g. 4 min read"
                                className="w-full px-4 py-2.5 bg-[#1e1e1e] border border-[#333] rounded-xl text-white text-sm focus:border-[#E8BF7A] focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Author Name</label>
                            <input
                                type="text"
                                value={authorName}
                                onChange={(e) => setAuthorName(e.target.value)}
                                placeholder="Crizbe Culinary Team"
                                className="w-full px-4 py-2.5 bg-[#1e1e1e] border border-[#333] rounded-xl text-white text-sm focus:border-[#E8BF7A] focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                            Article Excerpt / Summary <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            required
                            rows={2}
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            placeholder="Provide a concise 2-sentence summary for card previews and meta descriptions."
                            className="w-full px-4 py-2.5 bg-[#1e1e1e] border border-[#333] rounded-xl text-white text-sm focus:border-[#E8BF7A] focus:outline-none"
                        />
                    </div>

                    {/* Rich Content Editor with Formatting Toolbar */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-semibold text-gray-300">
                                Article Content (Rich HTML Body) <span className="text-red-400">*</span>
                            </label>
                            <span className="text-[11px] text-gray-400">Use toolbar below to style elements</span>
                        </div>

                        {/* Formatting Toolbar */}
                        <div className="bg-[#1a1a1a] border border-[#333] border-b-0 rounded-t-xl p-2 flex flex-wrap gap-1 items-center">
                            <button
                                type="button"
                                onClick={() => insertFormat('<h2>', '</h2>')}
                                className="p-1.5 text-xs text-gray-300 hover:text-[#E8BF7A] hover:bg-white/5 rounded transition flex items-center gap-1"
                                title="Heading 2"
                            >
                                <Heading2 className="w-4 h-4" /> H2
                            </button>
                            <button
                                type="button"
                                onClick={() => insertFormat('<h3>', '</h3>')}
                                className="p-1.5 text-xs text-gray-300 hover:text-[#E8BF7A] hover:bg-white/5 rounded transition flex items-center gap-1"
                                title="Heading 3"
                            >
                                <Heading3 className="w-4 h-4" /> H3
                            </button>
                            <button
                                type="button"
                                onClick={() => insertFormat('<p className="lead">', '</p>')}
                                className="p-1.5 text-xs text-gray-300 hover:text-[#E8BF7A] hover:bg-white/5 rounded transition"
                                title="Lead Paragraph"
                            >
                                Lead Paragraph
                            </button>
                            <div className="h-4 w-px bg-gray-700 mx-1" />
                            <button
                                type="button"
                                onClick={() => insertFormat('<strong>', '</strong>')}
                                className="p-1.5 text-gray-300 hover:text-[#E8BF7A] hover:bg-white/5 rounded transition"
                                title="Bold"
                            >
                                <Bold className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => insertFormat('<em>', '</em>')}
                                className="p-1.5 text-gray-300 hover:text-[#E8BF7A] hover:bg-white/5 rounded transition"
                                title="Italic"
                            >
                                <Italic className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => insertFormat('<blockquote>', '</blockquote>')}
                                className="p-1.5 text-gray-300 hover:text-[#E8BF7A] hover:bg-white/5 rounded transition"
                                title="Blockquote"
                            >
                                <Quote className="w-4 h-4" />
                            </button>
                            <div className="h-4 w-px bg-gray-700 mx-1" />
                            <button
                                type="button"
                                onClick={() => insertFormat('<ul>\n  <li>', '</li>\n</ul>')}
                                className="p-1.5 text-gray-300 hover:text-[#E8BF7A] hover:bg-white/5 rounded transition"
                                title="Bullet List"
                            >
                                <List className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => insertFormat('<ol>\n  <li>', '</li>\n</ol>')}
                                className="p-1.5 text-gray-300 hover:text-[#E8BF7A] hover:bg-white/5 rounded transition"
                                title="Numbered List"
                            >
                                <ListOrdered className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => insertFormat('<a href="https://crizbe.com/products">', '</a>')}
                                className="p-1.5 text-gray-300 hover:text-[#E8BF7A] hover:bg-white/5 rounded transition"
                                title="Link"
                            >
                                <LinkIcon className="w-4 h-4" />
                            </button>
                        </div>

                        <textarea
                            ref={textareaRef}
                            required
                            rows={8}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your article content using HTML formatting or the toolbar options above..."
                            className="w-full p-4 bg-[#1e1e1e] border border-[#333] rounded-b-xl text-white text-sm font-mono focus:border-[#E8BF7A] focus:outline-none leading-relaxed"
                        />
                    </div>

                    {/* Cover Image Upload */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">Cover Image</label>
                        <div className="flex items-center gap-4">
                            <label className="cursor-pointer px-4 py-2.5 bg-[#1e1e1e] border border-[#333] hover:border-[#E8BF7A] rounded-xl text-xs font-semibold text-gray-300 flex items-center gap-2 transition">
                                <Upload className="w-4 h-4 text-[#E8BF7A]" />
                                Choose Image File
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </label>
                            {coverImagePreview && (
                                <div className="relative w-16 h-16 rounded-xl border border-[#E8BF7A]/30 overflow-hidden bg-[#1e1e1e]">
                                    <img
                                        src={coverImagePreview}
                                        alt="Cover preview"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tags Manager */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">Tags</label>
                        <div className="flex items-center gap-2 mb-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addTag();
                                    }
                                }}
                                placeholder="Add a tag (e.g. Belgian Chocolate) and press Enter"
                                className="flex-1 px-4 py-2 bg-[#1e1e1e] border border-[#333] rounded-xl text-white text-xs focus:border-[#E8BF7A] focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={addTag}
                                className="px-3 py-2 bg-[#E8BF7A]/20 hover:bg-[#E8BF7A]/30 text-[#E8BF7A] text-xs font-bold rounded-xl transition"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((t) => (
                                <span
                                    key={t}
                                    className="px-3 py-1 bg-[#1e1e1e] border border-[#333] text-gray-300 text-xs rounded-full flex items-center gap-1.5"
                                >
                                    #{t}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(t)}
                                        className="hover:text-red-400"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="pt-4 border-t border-[#262626] flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-[#9A7236] via-[#E8BF7A] to-[#937854] text-[#141414] shadow-md hover:opacity-95 transition disabled:opacity-50"
                        >
                            {isLoading ? 'Saving...' : isEdit ? 'Update Article' : 'Create Article'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
