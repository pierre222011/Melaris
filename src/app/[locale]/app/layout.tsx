import Sidebar from '@/components/layout/Sidebar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050816] flex">
      <Sidebar />
      <div className="flex-1 ml-64 min-h-screen">
        {children}
      </div>
    </div>
  );
}
