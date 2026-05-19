import type { SVGProps } from 'react';

export function CommentIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M2.5 6C2.5 4.76 3.51 3.75 4.75 3.75H19.25C20.49 3.75 21.5 4.76 21.5 6V16.55C21.5 17.79 20.49 18.80 19.25 18.80H7.64L3.75 22.28C3.53 22.47 3.21 22.52 2.94 22.40C2.67 22.28 2.5 22.01 2.5 21.72V6ZM4.75 5.25C4.34 5.25 4 5.59 4 6V20.04L6.85 17.49C6.99 17.37 7.16 17.30 7.35 17.30H19.25C19.66 17.30 20 16.96 20 16.55V6C20 5.59 19.66 5.25 19.25 5.25H4.75Z" fill="currentColor" />
    </svg>
  );
}
