import type { SVGProps } from 'react';

export function PencilIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M16.29 2.29a1 1 0 0 1 1.41 0l4 4a1 1 0 0 1 0 1.41l-13 13A1 1 0 0 1 8 21H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 .293-.707l13-13ZM14 7.41l-9 9V19h2.59l9-9L14 7.41Zm3 1.17 2.59-2.59-2.59-2.59L14.41 6 17 8.59Z" fill="currentColor" />
    </svg>
  );
}
