export interface RoomMember {
  id: string;
  name: string;
  color: string;
  isMe?: boolean;
}

export interface MemberListSheetProps {
  members: RoomMember[];
  onClose: () => void;
}

export const MemberListSheet = ({ members, onClose }: MemberListSheetProps) => {
  return (
    <div
      className="absolute inset-0 bg-[rgba(15,20,30,0.45)] flex items-end z-10"
      onClick={onClose}
    >
      <div
        className="bg-white w-full rounded-tl-[22px] rounded-tr-[22px] px-5 pt-5 pb-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-4">
          <div className="bg-[#e0e3e8] h-1 rounded-sm w-9" />
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-[#1c2333] font-bold text-[17px]">참여자</span>
          <span className="text-[#9ca3af] text-[13px]">{members.length}명</span>
        </div>

        <div className="flex flex-col">
          {members.map((member, index) => (
            <div
              key={member.id}
              className={`flex items-center gap-3 py-[11px] ${index < members.length - 1 ? 'border-b border-[#f0f1f3]' : ''}`}
            >
              <div
                className="size-10 rounded-full shrink-0"
                style={{ backgroundColor: member.color }}
              />
              <span className="text-[#1c2333] text-[14px] font-medium flex-1">{member.name}</span>
              {member.isMe && <span className="text-[#9ca3af] text-[11.5px] font-normal">나</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
