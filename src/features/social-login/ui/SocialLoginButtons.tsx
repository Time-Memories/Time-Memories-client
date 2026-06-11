import { useEffect, useRef } from 'react';

import { ENDPOINTS } from '@shared/api';

import kakaoLoginImage from './assets/kakao_login.png';
import { GoogleIcon } from './GoogleIcon';

const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8080';
const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined)?.trim();
const GOOGLE_LOGIN_URI = (import.meta.env.VITE_GOOGLE_LOGIN_URI as string | undefined)?.trim();
const GOOGLE_SCRIPT_ID = 'google-identity-services';
const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';
const isGoogleIdentityEnabled = Boolean(GOOGLE_CLIENT_ID && GOOGLE_LOGIN_URI);

type GoogleIdentityConfig = {
  client_id: string;
  login_uri: string;
  ux_mode: 'popup' | 'redirect';
};

type GoogleButtonOptions = {
  locale: string;
  logo_alignment: 'left' | 'center';
  shape: 'rectangular' | 'pill' | 'circle' | 'square';
  size: 'large' | 'medium' | 'small';
  text: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  theme: 'outline' | 'filled_blue' | 'filled_black';
  type: 'standard' | 'icon';
  width: number;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleIdentityConfig) => void;
          renderButton: (parent: HTMLElement, options: GoogleButtonOptions) => void;
        };
      };
    };
  }
}

function getGoogleButtonWidth(element: HTMLElement): number {
  const width = element.clientWidth || 320;
  return Math.max(200, Math.min(400, Math.floor(width)));
}

export const SocialLoginButtons = () => {
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isGoogleIdentityEnabled || !GOOGLE_CLIENT_ID || !GOOGLE_LOGIN_URI) {
      return undefined;
    }

    const buttonElement = googleButtonRef.current;
    if (!buttonElement) {
      return undefined;
    }

    let disposed = false;
    let renderedWidth = 0;
    let scriptElement: HTMLScriptElement | null = null;

    const renderGoogleButton = () => {
      if (disposed || !window.google) return;

      const width = getGoogleButtonWidth(buttonElement);
      if (buttonElement.childElementCount > 0 && renderedWidth === width) return;

      renderedWidth = width;
      buttonElement.innerHTML = '';
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        login_uri: GOOGLE_LOGIN_URI,
        ux_mode: 'popup',
      });
      window.google.accounts.id.renderButton(buttonElement, {
        locale: 'ko',
        logo_alignment: 'left',
        shape: 'rectangular',
        size: 'large',
        text: 'continue_with',
        theme: 'outline',
        type: 'standard',
        width,
      });
    };

    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID) as HTMLScriptElement | null;
    if (window.google) {
      renderGoogleButton();
    } else if (existingScript) {
      scriptElement = existingScript;
      scriptElement.addEventListener('load', renderGoogleButton);
    } else {
      scriptElement = document.createElement('script');
      scriptElement.id = GOOGLE_SCRIPT_ID;
      scriptElement.src = GOOGLE_SCRIPT_SRC;
      scriptElement.async = true;
      scriptElement.defer = true;
      scriptElement.addEventListener('load', renderGoogleButton);
      document.head.appendChild(scriptElement);
    }

    const resizeObserver = new ResizeObserver(renderGoogleButton);
    resizeObserver.observe(buttonElement);

    return () => {
      disposed = true;
      resizeObserver.disconnect();
      scriptElement?.removeEventListener('load', renderGoogleButton);
    };
  }, []);

  const handleKakaoLogin = () => {
    window.location.href = `${BASE_URL}${ENDPOINTS.oauth.authorizeKakao}`;
  };

  const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL}${ENDPOINTS.oauth.authorizeGoogle}`;
  };

  return (
    <div className="flex flex-col items-center gap-2.5 pb-[11px]">
      <button
        type="button"
        onClick={handleKakaoLogin}
        className="h-[42px] w-full max-w-[400px] overflow-hidden rounded-[4px] bg-[#fee500] transition-opacity hover:opacity-90"
      >
        <img
          src={kakaoLoginImage}
          alt="카카오 로그인"
          className="block h-full w-full object-cover"
        />
      </button>

      {isGoogleIdentityEnabled ? (
        <>
          <div
            id="g_id_onload"
            data-client_id={GOOGLE_CLIENT_ID}
            data-login_uri={GOOGLE_LOGIN_URI}
            data-ux_mode="popup"
            data-auto_prompt="false"
          />
          <div
            ref={googleButtonRef}
            className="g_id_signin flex min-h-[44px] w-full max-w-[400px] items-center justify-center overflow-hidden rounded-[4px]"
            data-locale="ko"
            data-logo_alignment="left"
            data-shape="rectangular"
            data-size="large"
            data-text="continue_with"
            data-theme="outline"
            data-type="standard"
          />
        </>
      ) : (
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="relative flex h-[42px] w-full max-w-[400px] items-center rounded-[4px] border border-[#e5e7eb] bg-white"
        >
          <span className="absolute left-[4.85%] flex size-[18px] items-center justify-center">
            <GoogleIcon />
          </span>
          <span className="absolute left-[40.2%] whitespace-nowrap text-left text-[16px] font-bold leading-none text-[#1c2333]">
            Google 로그인
          </span>
        </button>
      )}

      <div className="flex justify-center pt-[10px]">
        <p className="m-0 text-center text-[10.5px] leading-[16.5px] text-[#9ca3af]">
          계속 진행 시 <span className="font-bold text-[#4b5563]">서비스 약관</span>과{' '}
          <span className="font-bold text-[#4b5563]">개인정보 처리방침</span>에 동의합니다
        </p>
      </div>
    </div>
  );
};
