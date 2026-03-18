import type { Metadata } from "next";
import AuthWrapper from "@/components/AuthWrapper";

export const metadata: Metadata = {
	title: "Admin Dashboard",
	description: "Admin Dashboard Overview",
};

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <AuthWrapper>{children}</AuthWrapper>;
}
