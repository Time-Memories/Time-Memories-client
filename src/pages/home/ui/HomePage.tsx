import { User } from 'lucide-react';
import { useState } from 'react';

import { InviteSheet } from '@widgets/invite-sheet';

import type { ViewTab } from '../model/types';
import { CalendarView } from './CalendarView';
import { RoomListView } from './RoomListView';
import { TabSwitcher } from './TabSwitcher';

const MOCK_INVITE = {
  roomCode: 'JEJU24',
  memberCount: 3,
  memberColors: ['#fde2dc', '#dde7f6', '#e5e7eb'],
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<ViewTab>('list');
  const [showInviteSheet, setShowInviteSheet] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(MOCK_INVITE.roomCode).catch(() => {});
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ text: MOCK_INVITE.roomCode }).catch(() => {});
    }
  };

  return (
    <div className="flex flex-col min-h-svh bg-white relative">
      <div className="flex items-center justify-between px-4.5 pt-2 pb-1.5">
        <h1 className="text-[#1c2333] text-[23.8px] font-bold tracking-[-0.4px]">Memories</h1>
        <button className="flex items-center justify-center size-9 rounded-[10px] hover:bg-[#f5f6f8] transition-colors">
          <User size={18} color="#1c2333" strokeWidth={1.5} />
        </button>
      </div>

      <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="h-px bg-[#eceef2] shrink-0" />

      {activeTab === 'list' ? (
        <RoomListView onJoinRoom={() => setShowInviteSheet(true)} />
      ) : (
        <CalendarView />
      )}

      {showInviteSheet && (
        <InviteSheet
          roomCode={MOCK_INVITE.roomCode}
          memberCount={MOCK_INVITE.memberCount}
          memberColors={MOCK_INVITE.memberColors}
          onClose={() => setShowInviteSheet(false)}
          onCopy={handleCopy}
          onShare={handleShare}
        />
      )}
    </div>
  );
}
