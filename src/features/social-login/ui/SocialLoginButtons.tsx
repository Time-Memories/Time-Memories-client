import { GoogleIcon } from './GoogleIcon';

export const SocialLoginButtons = () => {
  return (
    <div className="flex flex-col gap-2.5">
      <button
        type="button"
        className="flex w-full items-center justify-center gap-2.5 h-[50px] bg-[#fee500] border-2 border-black rounded-[14px]"
      >
        <span className="text-[11px] leading-none">💬</span>
        <span className="text-[#191600] text-sm font-semibold">카카오로 계속하기</span>
      </button>

      <button
        type="button"
        className="flex w-full items-center justify-center gap-2.5 h-[50px] bg-white border border-[#e5e7eb] rounded-[14px]"
      >
        <GoogleIcon />
        <span className="text-[#1c2333] text-sm font-bold">Google로 계속하기</span>
      </button>

      <div className="flex justify-center pt-[10px] pb-[11px]">
        <p className="text-[10.5px] text-[#9ca3af] text-center leading-[16.5px] m-0">
          계속 진행 시 <span className="text-[#4b5563] font-bold">서비스 약관</span>과{' '}
          <span className="text-[#4b5563] font-bold">개인정보 처리방침</span>에 동의합니다.
        </p>
      </div>
    </div>
  );
};
