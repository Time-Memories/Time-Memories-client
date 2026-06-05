import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-(--bg) p-6">
      <h1 className="m-0 text-2xl font-bold leading-snug text-(--text-h)">
        페이지를 찾을 수 없습니다
      </h1>
      <Link
        to="/"
        className="rounded-md bg-(--accent) px-3.5 py-2.5 text-sm font-bold leading-normal text-white"
      >
        홈으로 돌아가기
      </Link>
    </main>
  );
}
