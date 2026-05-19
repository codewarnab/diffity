import type { SVGProps } from 'react';

export function UndoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" d="M2.85 3.15a.5.5 0 0 0-.708 0l-2 2a.5.5 0 0 0 0 .708l2 2a.5.5 0 1 0 .708-.708L1.71 6H7.5A4.5 4.5 0 1 1 3 10.5a.5.5 0 0 0-1 0A5.5 5.5 0 1 0 7.5 5H1.71l1.15-1.15a.5.5 0 0 0 0-.708Z" />
    </svg>
  );
}
