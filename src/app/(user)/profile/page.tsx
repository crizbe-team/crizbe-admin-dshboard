import React from 'react';

export default function ProfilePage() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white/80 p-10 shadow-sm">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-600">
          This is your profile overview. Use the sidebar to navigate to different sections.
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-medium text-gray-600">Account</h2>
            <p className="mt-2 text-sm text-gray-500">Update your profile information and password.</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-medium text-gray-600">Orders</h2>
            <p className="mt-2 text-sm text-gray-500">Track your recent orders and view order details.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
