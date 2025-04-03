// components/Button.js
import Link from 'next/link';

export default function Button({ color = 'black', children, href }) {

    // the button colour can either be black or --button-grey-colour

    // if the colour is black, then the text colour is white
  const buttonClass = color === 'black'
    ? 'bg-black text-white hover:bg-[var(--second-button-colour)] transition'

    // otherwise, it's --text-colour
    : 'bg-[var(--button-grey-colour)] text-[var(--text-colour)] hover:bg-[var(--second-button-colour)] hover:text-white transition';

  return (
    <Link href={href} className={`rounded-lg px-4 py-2 inline-block ${buttonClass}`}>
      
        {children}

    </Link>
  );
}
