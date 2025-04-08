import Link from "next/link";

export default function ButtonCard({ title, altText, description, imageSrc, link }) {
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden max-w-[450px] max-h-[600px] w-full flex flex-col pt-10">
      <img src={imageSrc} alt={altText} className="w-20 h-20 ml-10" />
      <div className="p-10 flex flex-col h-64">
        <h2 className="text-2xl font-bold mb-2 pt-4">{title}</h2>
        <p className="text-base text-[var(--text-colour)] mb-4">{description}</p>
        <div className="mt-auto">
          <Link href={link}>
            <button className="w-full bg-[var(--button-colour)] text-white py-2 rounded-lg hover:bg-[var(--second-button-colour)] transition hover:cursor-pointer">
              Begin Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
