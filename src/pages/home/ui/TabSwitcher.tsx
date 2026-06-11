import { Calendar, List } from 'lucide-react';

import type { ViewTab } from '../model/types';

export interface TabSwitcherProps {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
}

export const TabSwitcher = ({ activeTab, onTabChange }: TabSwitcherProps) => {
  return (
    <div className="flex gap-[4px] items-center justify-center bg-[#f5f6f8] rounded-[14px] p-[4px] mx-[18px] mb-[8px]">
      <button
        onClick={() => onTabChange('list')}
        className={`flex flex-1 gap-[6px] items-center justify-center py-[9px] rounded-[11px] transition-all ${
          activeTab === 'list'
            ? 'bg-white shadow-[0px_1px_1px_rgba(0,0,0,0.04),0px_1px_0.5px_rgba(0,0,0,0.03)]'
            : ''
        }`}
      >
        <List size={14} color={activeTab === 'list' ? '#1c2333' : '#9ca3af'} strokeWidth={2} />
        <span
          className={`text-[12.9px] font-bold ${
            activeTab === 'list' ? 'text-[#1c2333]' : 'text-[#9ca3af]'
          }`}
        >
          리스트
        </span>
      </button>
      <button
        onClick={() => onTabChange('calendar')}
        className={`flex flex-1 gap-[6px] items-center justify-center py-[9px] rounded-[11px] transition-all ${
          activeTab === 'calendar'
            ? 'bg-white shadow-[0px_1px_1px_rgba(0,0,0,0.04),0px_1px_0.5px_rgba(0,0,0,0.03)]'
            : ''
        }`}
      >
        <Calendar
          size={14}
          color={activeTab === 'calendar' ? '#1c2333' : '#9ca3af'}
          strokeWidth={1.5}
        />
        <span
          className={`text-[13px] font-bold ${
            activeTab === 'calendar' ? 'text-[#1c2333]' : 'text-[#9ca3af]'
          }`}
        >
          달력
        </span>
      </button>
    </div>
  );
};
