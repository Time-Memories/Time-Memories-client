import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="min-h-svh bg-white dark:bg-white">
      <div
        className="relative mx-auto min-h-svh max-w-120 bg-white"
        style={{
          boxShadow: '0 0 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06)',
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}
