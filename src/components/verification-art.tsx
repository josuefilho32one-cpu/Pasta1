import { useId } from "react";

export function BrandMark({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 40 44" fill="none" aria-hidden="true"><path d="M20 2 37 8.5V21c0 10-9.8 17.4-17 21C12.8 38.4 3 31 3 21V8.5L20 2Z" fill="currentColor"/><path d="m11.5 21 5.8 6L29 14.5" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

export function VerificationArt() {
  const id = useId().replace(/:/g, "");
  return (
    <svg className="verification-art" viewBox="0 0 360 248" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-shield`} x1="176" y1="79" x2="264" y2="205" gradientUnits="userSpaceOnUse"><stop stopColor="#AD92FF"/><stop offset=".55" stopColor="#8E6AE9"/><stop offset="1" stopColor="#7651D3"/></linearGradient>
        <linearGradient id={`${id}-window`} x1="59" y1="53" x2="233" y2="180" gradientUnits="userSpaceOnUse"><stop stopColor="white"/><stop offset="1" stopColor="#F7F3FF"/></linearGradient>
        <filter id={`${id}-shadow`} x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="10" stdDeviation="11" floodColor="#6D4DB1" floodOpacity=".12"/></filter>
        <filter id={`${id}-shield-shadow`} x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="-3" dy="9" stdDeviation="8" floodColor="#6842B9" floodOpacity=".19"/></filter>
      </defs>
      <circle cx="183" cy="128" r="98" fill="#E9E1FE" fillOpacity=".65"/>
      <ellipse cx="185" cy="130" rx="145" ry="85" transform="rotate(-24 185 130)" stroke="#D5C8F4" strokeDasharray="3 7"/>
      <circle cx="52" cy="118" r="4" fill="#C5B1EF"/><circle cx="299" cy="185" r="3" fill="#C5B1EF"/>
      <g transform="rotate(-10 158 121)" filter={`url(#${id}-shadow)`}>
        <rect x="57" y="55" width="205" height="137" rx="13" fill={`url(#${id}-window)`} stroke="#E1D6F7" strokeWidth="1.4"/>
        <path d="M58 85h203" stroke="#E8E1F5"/>
        <circle cx="73" cy="71" r="3" fill="#C8B6EA"/><circle cx="84" cy="71" r="3" fill="#DED2F3"/><circle cx="95" cy="71" r="3" fill="#EAE2F7"/>
        <rect x="115" y="66" width="103" height="9" rx="4.5" fill="#F1ECFA"/>
        <rect x="74" y="102" width="26" height="26" rx="7" fill="#EAE1FC"/>
        <path d="m81 115 4 4 8-9" stroke="#AF94DD" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="111" y="105" width="99" height="6" rx="3" fill="#D7C8EC"/><rect x="111" y="117" width="68" height="5" rx="2.5" fill="#E9E1F3"/>
        <rect x="74" y="141" width="142" height="5" rx="2.5" fill="#E6DDF2"/><rect x="74" y="154" width="117" height="5" rx="2.5" fill="#E6DDF2"/><rect x="74" y="167" width="82" height="5" rx="2.5" fill="#E6DDF2"/>
      </g>
      <ellipse cx="219" cy="215" rx="55" ry="8" fill="#BFA8EA" fillOpacity=".16"/>
      <g filter={`url(#${id}-shield-shadow)`}>
        <path d="M220 73c16 12 32 18 52 21v38c0 34-21 59-52 76-31-17-52-42-52-76V94c20-3 36-9 52-21Z" fill="#7955CB"/>
        <path d="M214 69c16 12 32 18 52 21v38c0 34-21 59-52 76-31-17-52-42-52-76V90c20-3 36-9 52-21Z" fill={`url(#${id}-shield)`}/>
        <path d="M214 80c13 9 27 15 42 18v30c0 28-16 49-42 64-26-15-42-36-42-64V98c15-3 29-9 42-18Z" stroke="#CEB8FF" strokeOpacity=".65" strokeWidth="1.3"/>
        <path d="m190 133 17 17 34-37" stroke="#fff" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <g transform="rotate(12 290 147)" filter={`url(#${id}-shadow)`}>
        <rect x="269" y="128" width="43" height="39" rx="11" fill="white" stroke="#EAE2F6"/>
        <path d="M280 140h21M280 147h15M280 154h10" stroke="#B8A1DE" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
      <g transform="rotate(-12 80 192)" filter={`url(#${id}-shadow)`}>
        <rect x="59" y="170" width="43" height="43" rx="12" fill="#fff" stroke="#EAE2F6"/>
        <path d="m77 187-4 4a5 5 0 0 0 7 7l4-4m0-6 4-4a5 5 0 0 0-7-7l-4 4m-1 13 10-10" stroke="#9B7ED3" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
      <g filter={`url(#${id}-shadow)`}>
        <rect x="32" y="40" width="131" height="29" rx="14.5" fill="white" stroke="#E9E1F4"/>
        <circle cx="48" cy="54.5" r="7" fill="#E3F2E9"/><path d="m45 54.5 2 2 4-4" stroke="#5D9877" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <text x="61" y="58" fill="#6C627C" fontFamily="var(--font-dm-sans), sans-serif" fontSize="10" fontWeight="500">Um olhar mais atento</text>
      </g>
      <path d="M286 43c0 7-4 11-11 11 7 0 11 4 11 11 0-7 4-11 11-11-7 0-11-4-11-11Z" fill="#AB8AE0"/>
      <path d="M126 216c0 4-2 6-6 6 4 0 6 2 6 6 0-4 2-6 6-6-4 0-6-2-6-6Z" fill="#B79BDF"/>
      <circle cx="245" cy="32" r="2.5" fill="#D0BCEE"/>
    </svg>
  );
}
