'use client';

import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import {
    Users,
    Plus,
    Edit2,
    Trash2,
    X,
    RefreshCw,
    ShieldCheck,
    Lock,
    UserCheck,
} from 'lucide-react';
import {
    useFetchAdminUsers,
    useFetchAdminRoles,
    useCreateAdminUserMutation,
    useUpdateAdminUserMutation,
    useDeleteAdminUserMutation,
} from '@/queries/use-account';
import DashboardConfirmationModal from '@/components/Modals/DashboardConfirmationModal';
import { AdminUserData, RoleData } from '@/services/account';
import DebouncedSearch from '@/components/ui/DebouncedSearch';
import Pagination from '@/components/ui/Pagination';

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

export default function AdminUsersPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const {
        data: usersRes,
        isLoading: isUsersLoading,
        isRefetching,
        refetch,
    } = useFetchAdminUsers({
        page: currentPage,
        q: searchQuery,
    });
    const { data: rolesRes } = useFetchAdminRoles();

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const createUserMutation = useCreateAdminUserMutation();
    const updateUserMutation = useUpdateAdminUserMutation();
    const deleteUserMutation = useDeleteAdminUserMutation();

    const users: AdminUserData[] = usersRes?.data || [];
    const roles: RoleData[] = rolesRes?.data || [];

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUserData | null>(null);

    const [formUsername, setFormUsername] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formFirstName, setFormFirstName] = useState('');
    const [formLastName, setFormLastName] = useState('');
    const [formPassword, setFormPassword] = useState('');
    const [formAssignedRole, setFormAssignedRole] = useState<string>('');
    const [formActive, setFormActive] = useState(true);

    const openAddModal = () => {
        setEditingUser(null);
        setFormUsername('');
        setFormEmail('');
        setFormFirstName('');
        setFormLastName('');
        setFormPassword('');
        setFormAssignedRole(roles.length > 0 ? roles[0].id || '' : '');
        setFormActive(true);
        setIsModalOpen(true);
    };

    const openEditModal = (u: AdminUserData) => {
        setEditingUser(u);
        setFormUsername(u.username);
        setFormEmail(u.email);
        setFormFirstName(u.first_name || '');
        setFormLastName(u.last_name || '');
        setFormPassword('');
        setFormAssignedRole(u.assigned_role || '');
        setFormActive(u.is_active ?? true);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload: Partial<AdminUserData> = {
            username: formUsername.trim(),
            email: formEmail.trim(),
            first_name: formFirstName.trim(),
            last_name: formLastName.trim(),
            assigned_role: formAssignedRole || null,
            is_active: formActive,
        };

        if (formPassword) {
            payload.password = formPassword;
        }

        if (editingUser && editingUser.id) {
            await updateUserMutation.mutateAsync({ id: editingUser.id, data: payload });
        } else {
            await createUserMutation.mutateAsync(payload);
        }

        setIsModalOpen(false);
    };

    const handleToggleActive = async (u: AdminUserData) => {
        if (!u.id) return;
        await updateUserMutation.mutateAsync({
            id: u.id,
            data: { is_active: !u.is_active },
        });
    };

    const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

    const confirmDeleteUser = async () => {
        if (deleteUserId) {
            await deleteUserMutation.mutateAsync(deleteUserId);
            setDeleteUserId(null);
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
                        <Users className="w-9 h-9 text-[#E8BF7A]" />
                        Sub-Admin User Management
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base font-medium">
                        Create sub-admin login accounts (username, password, assigned role) to
                        enforce role-based access.
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
                        onClick={openAddModal}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#9A7236] to-[#E8BF7A] text-[#1a1a1a] font-bold text-sm hover:brightness-110 shadow-lg transition flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Create User
                    </button>
                </div>
            </motion.div>

            {/* Users Table */}
            <motion.div
                variants={itemVariants}
                className="bg-[#141414] rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
            >
                <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <UserCheck className="w-5 h-5 text-[#E8BF7A]" />
                        <h2 className="text-lg font-bold text-white">Configured Admin Accounts</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <DebouncedSearch
                            onSearch={setSearchQuery}
                            placeholder="Search accounts..."
                            className="max-w-xs"
                        />
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E8BF7A]/10 text-[#E8BF7A] border border-[#E8BF7A]/20">
                            {usersRes?.pagination?.total_items ?? users.length} Users
                        </span>
                    </div>
                </div>

                {isUsersLoading ? (
                    <div className="p-12 text-center text-gray-400 font-medium animate-pulse">
                        Loading admin user accounts...
                    </div>
                ) : users.length === 0 ? (
                    <div className="p-12 text-center text-gray-400 font-medium">
                        No sub-admin users created yet. Click "Create User" to add account logins.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-300">
                            <thead className="bg-white/5 text-gray-400 uppercase text-[11px] font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">User Details</th>
                                    <th className="px-6 py-4">Assigned Role</th>
                                    <th className="px-6 py-4">Allowed Accesses</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-medium">
                                {users.map((u) => (
                                    <tr
                                        key={u.id || u.username}
                                        className="hover:bg-white/[0.02] transition"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#9A7236]/30 to-[#E8BF7A]/20 border border-[#E8BF7A]/30 flex items-center justify-center font-bold text-white uppercase text-sm">
                                                    {u.username.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white text-base leading-snug">
                                                        {u.first_name || u.last_name
                                                            ? `${u.first_name || ''} ${u.last_name || ''}`.trim()
                                                            : u.username}
                                                    </h4>
                                                    <p className="text-gray-400 text-xs font-mono">
                                                        @{u.username} • {u.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#E8BF7A]/10 text-[#E8BF7A] border border-[#E8BF7A]/30 text-xs font-bold">
                                                <ShieldCheck className="w-3.5 h-3.5" />
                                                {u.assigned_role_name || 'Super Admin (All Access)'}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1 max-w-xs">
                                                {(u.permissions || []).slice(0, 4).map((p) => (
                                                    <span
                                                        key={p}
                                                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/5 text-gray-300 border border-white/10"
                                                    >
                                                        {p}
                                                    </span>
                                                ))}
                                                {(u.permissions || []).length > 4 && (
                                                    <span className="text-[10px] font-semibold px-1.5 py-0.5 text-gray-400">
                                                        +{(u.permissions || []).length - 4} more
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleActive(u)}
                                                className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                                                    u.is_active
                                                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                                }`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-emerald-400' : 'bg-rose-400'}`}
                                                />
                                                {u.is_active ? 'Active' : 'Disabled'}
                                            </button>
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(u)}
                                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition"
                                                    title="Edit User & Assigned Role"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteUserId(u.id || null)}
                                                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                                                    title="Deactivate Account"
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

                {usersRes?.pagination && usersRes.pagination.total_pages > 1 && (
                    <div className="p-4 border-t border-white/10">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={usersRes.pagination.total_pages}
                            onPageChange={setCurrentPage}
                            hasNext={usersRes.pagination.has_next}
                            hasPrevious={usersRes.pagination.has_previous}
                        />
                    </div>
                )}
            </motion.div>

            {/* Modal for Creating / Editing Sub-Admin User */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative my-8"
                    >
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-5 right-5 text-gray-400 hover:text-white transition"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-2">
                            <Lock className="w-6 h-6 text-[#E8BF7A]" />
                            <h3 className="text-xl font-bold text-white font-bricolage">
                                {editingUser
                                    ? 'Edit Sub-Admin User'
                                    : 'Create Sub-Admin User Account'}
                            </h3>
                        </div>
                        <p className="text-gray-400 text-xs mb-6">
                            Assign login username, password, and role to restrict dashboard access
                            based on permissions.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-300 uppercase mb-1.5">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formUsername}
                                        onChange={(e) => setFormUsername(e.target.value)}
                                        placeholder="e.g. content_writer_1"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#E8BF7A]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-300 uppercase mb-1.5">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formEmail}
                                        onChange={(e) => setFormEmail(e.target.value)}
                                        placeholder="writer@crizbe.com"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#E8BF7A]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-300 uppercase mb-1.5">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formFirstName}
                                        onChange={(e) => setFormFirstName(e.target.value)}
                                        placeholder="e.g. Alex"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#E8BF7A]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-300 uppercase mb-1.5">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formLastName}
                                        onChange={(e) => setFormLastName(e.target.value)}
                                        placeholder="e.g. Morgan"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#E8BF7A]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-300 uppercase mb-1.5">
                                    {editingUser
                                        ? 'New Password (Leave blank to keep current)'
                                        : 'Account Password'}
                                </label>
                                <input
                                    type="password"
                                    required={!editingUser}
                                    value={formPassword}
                                    onChange={(e) => setFormPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#E8BF7A]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#E8BF7A] uppercase mb-1.5">
                                    Assign Administrative Role
                                </label>
                                <select
                                    value={formAssignedRole}
                                    onChange={(e) => setFormAssignedRole(e.target.value)}
                                    className="w-full bg-[#141414] border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E8BF7A] font-semibold"
                                >
                                    <option value="">
                                        -- Select Role (Default: Full Super Admin) --
                                    </option>
                                    {roles.map((r) => (
                                        <option key={r.id || r.name} value={r.id}>
                                            {r.name} ({r.permissions?.length ?? 0} accesses)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    id="userActiveCheck"
                                    checked={formActive}
                                    onChange={(e) => setFormActive(e.target.checked)}
                                    className="w-4 h-4 rounded border-white/10 text-[#E8BF7A] focus:ring-0 accent-[#E8BF7A]"
                                />
                                <label
                                    htmlFor="userActiveCheck"
                                    className="text-sm font-semibold text-gray-300"
                                >
                                    Account Enabled (User can login)
                                </label>
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-semibold transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={
                                        createUserMutation.isPending || updateUserMutation.isPending
                                    }
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#9A7236] to-[#E8BF7A] text-[#1a1a1a] font-bold text-sm hover:brightness-110 shadow-lg transition flex items-center justify-center gap-2"
                                >
                                    {(createUserMutation.isPending ||
                                        updateUserMutation.isPending) && (
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                    )}
                                    Save User Account
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Reusable Confirmation Modal */}
            <DashboardConfirmationModal
                open={!!deleteUserId}
                onClose={() => setDeleteUserId(null)}
                onConfirm={confirmDeleteUser}
                title="Deactivate Sub-Admin Account"
                description="Are you sure you want to deactivate this sub-admin user account? The user will no longer be able to log in to the dashboard."
                confirmText="Deactivate Account"
                isPending={deleteUserMutation.isPending}
            />
        </motion.div>
    );
}
