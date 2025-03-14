// components for cards with buttons
import Link from "next/link";

export default function ButtonCard({ title, description, image, link }) {
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden max-w-[474px] max-h-[394px] w-full flex flex-col">
      <img src={image} alt={title} className="w-full h-64 object-cover" />
      <div className="p-10 flex flex-col h-64">
        <h2 className="text-2xl font-bold mb-2 pt-4">{title}</h2>
        <p className="text-base text-[var(--text-colour)] mb-4">{description}</p>
        <div className="mt-auto">
          <Link href={link}>
            <button className="w-full bg-[var(--button-colour)] text-white py-2 rounded-lg hover:bg-blue-600 transition">
              Begin Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
