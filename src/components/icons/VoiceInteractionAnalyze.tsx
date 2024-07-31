interface VoiceInteractionAnalyzeProps {
  width?: number;
  height?: number;
}

const VoiceInteractionAnalyze: React.FC<VoiceInteractionAnalyzeProps> = ({ width = 68, height = 68 }) => {
  const bounceKeyframes = `
    @keyframes bounce {
      0%, 80%, 100% { 
        transform: scale(0.5);
        opacity: 0.5;
      } 
      40% { 
        transform: scale(1);
        opacity: 1;
      }
    }
  `;

  const dotStyle = (delay: string) => ({
    animation: `bounce 1.4s infinite ease-in-out both`,
    animationDelay: delay
  });

  return (
    <>
      <style>{bounceKeyframes}</style>
      <svg width={width} height={height} viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_b_935_40757)">
          <path
            d="M0 34C0 15.2223 15.2223 0 34 0V0C52.7777 0 68 15.2223 68 34V34C68 52.7777 52.7777 68 34 68V68C15.2223 68 0 52.7777 0 34V34Z"
            fill="white"
            fillOpacity="0.56"
          />
          <g filter="url(#filter1_b_935_40757)">
            <rect width="68" height="68" rx="34" fill="url(#paint0_linear_935_40757)" />
          </g>
        </g>
        {/* 애니메이션이 있는 점들 추가 */}
        <circle style={dotStyle("-0.32s")} cx="28" cy="34" r="3" fill="white" />
        <circle style={dotStyle("-0.16s")} cx="34" cy="34" r="3" fill="white" />
        <circle style={dotStyle("0s")} cx="40" cy="34" r="3" fill="white" />
        <defs>
          <filter
            id="filter0_b_935_40757"
            x="-26"
            y="-26"
            width="120"
            height="120"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="13" />
            <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_935_40757" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_935_40757" result="shape" />
          </filter>
          <filter
            id="filter1_b_935_40757"
            x="-26"
            y="-26"
            width="120"
            height="120"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="13" />
            <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_935_40757" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_935_40757" result="shape" />
          </filter>
          <linearGradient
            id="paint0_linear_935_40757"
            x1="78.88"
            y1="137.02"
            x2="-12.5786"
            y2="25.9097"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF9524" />
            <stop offset="1" stopColor="#5B4DFF" />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
};

export default VoiceInteractionAnalyze;
