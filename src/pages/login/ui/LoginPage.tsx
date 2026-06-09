import { SocialLoginButtons } from '@features/social-login';

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh flex-col bg-white px-6">
      <div className="flex flex-col gap-2.5 pt-16">
        <div className="flex items-center justify-center size-14 bg-[#1c2333] rounded-[18px] shrink-0">
          <span className="text-white text-[22px] font-bold tracking-[-1px]">M</span>
        </div>

        <div className="flex flex-col pt-3">
          <h1 className="text-[#1c2333] text-[26px] font-bold leading-[33.6px] tracking-[-0.5px] m-0">
            우리만의 일기장,
            <br />
            Memories
          </h1>
        </div>

        <p className="text-[#4b5563] text-[13px] font-normal leading-[21px] m-0">
          오늘 하루를 기록하고,
          <br />
          친구들과 함께 쌓아가요.
        </p>
      </div>

      <div className="flex-1" />

      <SocialLoginButtons />
    </main>
  );
}
