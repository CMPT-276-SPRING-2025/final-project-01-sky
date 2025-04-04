// component for cards that display reason
export default function ReasonCard({ title, altText, description, image }) {
    return (
        <div className="bg-white shadow-lg rounded-lg w-[303.33px] h-[295.27px] flex flex-col p-4">
            <img src={image} alt={altText} className="w-full h-48 object-cover rounded-lg" />
            <div className="flex flex-col justify-between mt-4">
                <h2 className="text-xl font-semibold">{title}</h2>
                <p className="text-base text-[var(--text-colour)] mt-2">
                    {description}
                </p>
            </div>
        </div>
    );
}