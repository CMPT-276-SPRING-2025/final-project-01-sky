import Link from 'next/link';

export default function Button({ color = 'black', children, href, onClick }) {
  // Determine button styles based on the color prop
  const buttonClass =
    color === 'black'
      ? 'bg-black text-white hover:bg-[var(--second-button-colour)] transition'
      : 'bg-[var(--button-grey-colour)] text-[var(--text-colour)] hover:bg-[var(--second-button-colour)] hover:text-white transition cursor-pointer';

  // If an href is provided, render a Link. Otherwise, render a button.
  return href ? (
    <Link href={href} className={`rounded-lg px-4 py-2 inline-block ${buttonClass}`}>
      {children}
    </Link>
  ) : (
    <button onClick={onClick} className={`rounded-lg px-4 py-2 ${buttonClass}`}>
      {children}
    </button>
  );
}
