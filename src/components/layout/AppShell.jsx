import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { DoNotDisturbOverlay } from './DoNotDisturbOverlay';

export function AppShell() {
  const [doNotDisturb, setDoNotDisturb] = useState(false);

  return (
    <>
      <div className="flex min-h-screen bg-white dark:bg-black">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar onOpenDoNotDisturb={() => setDoNotDisturb(true)} />
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
      {doNotDisturb && (
        <DoNotDisturbOverlay onClose={() => setDoNotDisturb(false)} />
      )}
    </>
  );
}
