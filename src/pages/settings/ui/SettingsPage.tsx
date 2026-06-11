import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ChevronLeft, ImageOff, LogOut, Pencil, Upload } from 'lucide-react';

import { useAuthStore } from '@shared/model';
import { editMe } from '@shared/api';

export default function SettingsPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const updateUser = useAuthStore((s) => s.updateUser);

  const [editingNickname, setEditingNickname] = useState(false);
  const [draft, setDraft] = useState(user?.name ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const savingRef = useRef(false);

  const currentName = user?.name ?? '';

  const handleEditNickname = () => {
    setDraft(currentName);
    setEditingNickname(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleConfirmNickname = async () => {
    if (savingRef.current) return;

    const trimmed = draft.trim();
    if (!trimmed || trimmed === currentName) {
      setEditingNickname(false);
      return;
    }
    savingRef.current = true;
    setIsSaving(true);
    try {
      const updatedUser = await editMe({ name: trimmed });

      if (updatedUser?.name) {
        updateUser({ name: updatedUser.name });
      } else {
        await checkAuth();
      }
    } finally {
      savingRef.current = false;
      setIsSaving(false);
      setEditingNickname(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleChangePhoto = () => {
    setShowAvatarMenu(false);
    fileInputRef.current?.click();
  };

  const handleResetPhoto = () => {
    setShowAvatarMenu(false);
  };

  return (
    <div className="flex flex-col min-h-svh bg-[#f5f6f8]">
      <div className="bg-white shrink-0 flex items-center justify-between px-4 pt-[14px] pb-[15px] border-b border-[#eceef2]">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center size-8">
          <ChevronLeft size={20} color="#1c2333" strokeWidth={1.5} />
        </button>
        <span className="text-[#1c2333] text-[15px] font-bold">설정</span>
        <div className="size-8" />
      </div>

      <div className="flex flex-col items-center pt-9 pb-8 px-5">
        <div className="relative mb-4">
          <div className="size-20.5 rounded-full bg-[#dde7f6]" />
          <button
            onClick={() => setShowAvatarMenu(true)}
            className="absolute bottom-0 right-0 bg-[#1c2333] rounded-full size-6.5 flex items-center justify-center border-2 border-[#f5f6f8]"
          >
            <Camera size={12} color="white" strokeWidth={2} />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={() => {}}
          />
        </div>

        {editingNickname ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && void handleConfirmNickname()}
            onBlur={() => void handleConfirmNickname()}
            maxLength={16}
            disabled={isSaving}
            className="text-[#1c2333] font-bold text-[19px] text-center bg-transparent border-b-2 border-[#1c2333] outline-none w-40 pb-0.5 disabled:opacity-60"
          />
        ) : (
          <button onClick={handleEditNickname} className="flex items-center gap-1.5 group">
            <span className="text-[#1c2333] font-bold text-[19px]">{currentName}</span>
            <Pencil size={13} color="#9ca3af" strokeWidth={1.5} />
          </button>
        )}

        {user?.email && <span className="text-[#9ca3af] text-[12px] mt-1">{user.email}</span>}
      </div>

      <div className="flex flex-col gap-3 px-[18px]">
        <div>
          <span className="text-[#9ca3af] text-[11.3px] font-medium px-1 mb-2 block">계정</span>
          <div className="bg-white rounded-[14px] border border-[#eceef2] overflow-hidden">
            <button
              onClick={handleEditNickname}
              className="flex items-center justify-between w-full px-4 py-3.75 hover:bg-[#fafbfc] transition-colors"
            >
              <span className="text-[#1c2333] text-[14px]">닉네임</span>
              <span className="text-[#9ca3af] text-[13px]">{currentName}</span>
            </button>
            <div className="h-px bg-[#f0f1f3] mx-4" />
            <button
              onClick={() => setShowAvatarMenu(true)}
              className="flex items-center justify-between w-full px-4 py-3.75 hover:bg-[#fafbfc] transition-colors"
            >
              <span className="text-[#1c2333] text-[14px]">프로필 사진</span>
            </button>
          </div>
        </div>

        <div>
          <span className="text-[#9ca3af] text-[11.3px] font-medium px-1 mb-2 block">기타</span>
          <div className="bg-white rounded-[14px] border border-[#eceef2] overflow-hidden">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3.75 hover:bg-[#fff5f5] transition-colors gap-2.5"
            >
              <LogOut size={15} color="#ef4444" strokeWidth={1.5} />
              <span className="text-[#ef4444] text-[14px]">로그아웃</span>
            </button>
          </div>
        </div>
      </div>

      {showAvatarMenu && (
        <div
          className="absolute inset-0 bg-[rgba(15,20,30,0.45)] flex items-end justify-center z-10"
          onClick={() => setShowAvatarMenu(false)}
        >
          <div
            className="bg-white w-full pb-6 pt-5 px-5 rounded-tl-[22px] rounded-tr-[22px] flex flex-col gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-1">
              <div className="bg-[#e0e3e8] h-1 rounded-sm w-9" />
            </div>
            <span className="text-[#1c2333] font-bold text-[16px] mb-1">프로필 사진</span>

            <button
              onClick={handleChangePhoto}
              className="flex items-center gap-3 px-1 py-3.25 border-b border-[#f0f1f3]"
            >
              <div className="size-9 rounded-full bg-[#f5f6f8] flex items-center justify-center shrink-0">
                <Upload size={16} color="#1c2333" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[#1c2333] text-[14px] font-medium">사진 변경</span>
                <span className="text-[#9ca3af] text-[11.5px]">갤러리에서 사진을 선택해요</span>
              </div>
            </button>

            <button onClick={handleResetPhoto} className="flex items-center gap-3 px-1 py-3.25">
              <div className="size-9 rounded-full bg-[#f5f6f8] flex items-center justify-center shrink-0">
                <ImageOff size={16} color="#4b5563" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[#1c2333] text-[14px] font-medium">기본 사진으로 변경</span>
                <span className="text-[#9ca3af] text-[11.5px]">
                  프로필을 기본 이미지로 되돌려요
                </span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
