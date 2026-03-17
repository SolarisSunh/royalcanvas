import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { DoNotDisturbOverlay } from './DoNotDisturbOverlay';
import { EnvironmentSimulator } from './EnvironmentSimulator';

export function AppShell({ environment = 'royal' }) {
  const [doNotDisturb, setDoNotDisturb] = useState(false);

  const shellBg =
    environment === 'royal'
      ? 'bg-gradient-to-br from-slate-950 via-slate-950 to-indigo-950'
      : environment === 'institucion'
        ? 'bg-gradient-to-br from-slate-950 via-slate-950 to-emerald-950'
        : 'bg-gradient-to-br from-slate-950 via-slate-950 to-fuchsia-950';

  return (
    <>
      <div className={`flex min-h-screen ${shellBg}`}>
        <Sidebar environment={environment} />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar environment={environment} onOpenDoNotDisturb={() => setDoNotDisturb(true)}>
            <EnvironmentSimulator />
          </Topbar>
          <main className="flex-1 overflow-auto p-6 bg-white/0">
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
