import donation from "../../assets/donation.png";

export default function DonationMainPage() {
    return (
        <section className="">
            <div
                className="relative w-full h-96 flex items-end"
                style={{
                    backgroundImage: `url(${donation})`,
                    backgroundSize: 'cover',         // Ensures image fills the area
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                <div className="relative w-full max-w-7xl px-6 lg:px-20 pb-12">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-2">Donations</h1>
                    <p className="text-xl text-white/90">
                        Your Kindness Makes a Difference and Be the Reason Someone Smiles Today
                    </p>
                </div>
            </div>

            <h1 className="px-20">
                Featured Programs
            </h1>
        </section>
    );
}
