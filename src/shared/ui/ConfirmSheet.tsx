export interface ConfirmSheetProps {
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  isPending?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmSheet = ({
  title,
  description,
  confirmLabel,
  cancelLabel = '취소',
  isPending = false,
  onConfirm,
  onClose,
}: ConfirmSheetProps) => {
  return (
    <div
      className="absolute inset-0 bg-[rgba(15,20,30,0.45)] flex items-end justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-full rounded-tl-[22px] rounded-tr-[22px] px-5 pt-5 pb-8 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-1">
          <div className="bg-[#e0e3e8] h-1 rounded-sm w-9" />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[#1c2333] font-bold text-[17px]">{title}</span>
          {description && <p className="text-[#4b5563] text-[13px] leading-5">{description}</p>}
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="w-full h-12 rounded-[14px] text-[14px] font-semibold disabled:opacity-40 transition-opacity bg-[#1c2333] text-white hover:opacity-90"
          >
            {confirmLabel}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="w-full h-12 rounded-[14px] text-[14px] font-semibold text-[#4b5563] bg-[#f5f6f8] hover:bg-[#eceef2] transition-colors disabled:opacity-40"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
