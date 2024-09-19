import Sidebar from "@/app/(dashboard)/_components/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-50 hidden h-full w-56 flex-col md:flex">
        <Sidebar />
      </div>
      <main className="md:pl-56">{children}</main>
    </div>
  );
};

export default DashboardLayout;
