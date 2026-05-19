interface FolderIconProps {
  open: boolean;
}

export function FolderIcon(props: FolderIconProps) {
  if (props.open) {
    return (
      <svg className="size-4 shrink-0 text-[#569fff]" viewBox="0 0 16 16" fill="currentColor">
        <path d="M.513 1.51A1.75 1.75 0 0 1 1.75 1h3.5c.55 0 1.07.26 1.4.7l.9 1.2a.25.25 0 0 0 .2.1H13a1 1 0 0 1 1 1v.5H2.75a.75.75 0 0 0 0 1.5h11.98a1 1 0 0 1 .994 1.12L15 13.25A1.75 1.75 0 0 1 13.25 15H1.75A1.75 1.75 0 0 1 0 13.25V2.75c0-.464.18-.91.51-1.24Z" />
      </svg>
    );
  }

  return (
    <svg
      className='size-4 shrink-0 text-[#569fff]'
      viewBox='0 0 16 16'
      fill='currentColor'
    >
      <path d='M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.22.78 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25v-8.5A1.75 1.75 0 0 0 14.25 3H7.5a.25.25 0 0 1-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75Z' />
    </svg>
  );
}
