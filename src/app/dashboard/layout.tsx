import type { Metadata } from "next";
import AuthWrapper from "@/components/AuthWrapper";
import "locomotive-scroll/dist/locomotive-scroll.css";


export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard Overview",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
        <AuthWrapper>
          {children}
        </AuthWrapper>
      
  );
}
