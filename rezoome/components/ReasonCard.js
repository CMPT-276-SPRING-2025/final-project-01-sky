// component for cards that display reason
export default function ReasonCard({ title, altText, description, imageSrc }) {
    return (
        <div className="bg-white shadow-lg rounded-lg w-[303.33px] h-[295.27px] flex flex-col p-4">
            <img src={imageSrc} alt={altText} className="object-cover rounded-lg w-30 p-5 h-30 object-cover rounded-lg" />
            <div className="flex flex-col justify-between mt-4">
                <h2 className="text-xl font-semibold  pl-5">{title}</h2>
                <p className="text-base text-[var(--text-colour)] mt-2 pl-5 ">
                    {description}
                </p>
            </div>
        </div>
    );
}