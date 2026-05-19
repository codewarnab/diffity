interface FileIconProps {
  className?: string;
}

export function FileIcon(props: FileIconProps) {
  const { className = 'size-4 shrink-0 text-text-muted' } = props;
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path d="M2 1.75C2 .784 2.78 0 3.75 0h6.59c.464 0 .909.18 1.24.51l2.91 2.91c.329.33.51.77.51 1.24v9.59A1.75 1.75 0 0113.25 16h-9.5A1.75 1.75 0 012 14.25V1.75zm1.75-.25a.25.25 0 00-.25.25v12.5c0 .138.11.25.25.25h9.5a.25.25 0 00.25-.25V6h-2.75A1.75 1.75 0 019 4.25V1.5H3.75zm6.75.06V4.25c0 .138.11.25.25.25h2.69l-.011-.013-2.91-2.91-.013-.011z" />
    </svg>
  );
}
