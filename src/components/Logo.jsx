export default function Logo({ className = "w-8 h-8" }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 배경 원 - 캠퍼스를 상징 */}
      <circle cx="20" cy="20" r="18" fill="#0ea5e9" opacity="0.1" />

      {/* 학사모 아이콘 - 학생을 상징 */}
      <g transform="translate(8, 10)">
        {/* 학사모 윗면 */}
        <path
          d="M12 2L2 7L12 12L22 7L12 2Z"
          fill="#f04438"
        />
        {/* 학사모 테두리 */}
        <path
          d="M12 2L2 7L12 12L22 7L12 2Z"
          stroke="#d92d20"
          strokeWidth="1"
          fill="none"
        />
        {/* 술 */}
        <circle cx="12" cy="7" r="1" fill="#f04438" />
        <line x1="12" y1="8" x2="12" y2="14" stroke="#f04438" strokeWidth="0.8" />
        <circle cx="12" cy="14" r="1.5" fill="#f04438" />

        {/* 연결선 - 연결을 상징하는 곡선 */}
        <path
          d="M12 12 Q 18 14, 22 10"
          stroke="#0ea5e9"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="22" cy="10" r="1.5" fill="#0ea5e9" />
      </g>
    </svg>
  );
}
