export interface MemberAvatarsProps {
  colors: string[];
}

export const MemberAvatars = ({ colors }: MemberAvatarsProps) => {
  return (
    <div className="flex items-center">
      {colors.map((color, index) => (
        <div
          key={index}
          className="size-[22px] rounded-full border-2 border-white"
          style={{
            backgroundColor: color,
            marginLeft: index > 0 ? '-6px' : '0',
            position: 'relative',
            zIndex: colors.length - index,
          }}
        />
      ))}
    </div>
  );
};
