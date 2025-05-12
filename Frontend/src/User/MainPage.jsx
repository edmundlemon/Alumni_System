import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import mmuCampus from "../assets/mmuCampus.png";
import alumni from "../assets/alumni.png";

export default function MainPage() {
  return (
    <section className="">
      <div
        className="flex justify-between items-center w-full h-80 bg-cover bg-center bg-no-repeat px-4"
        style={{ backgroundImage: `url(${alumni})` }}
      >
        <button className="bg-white/70 p-2 rounded-full hover:bg-white/90">
          <FaChevronLeft />
        </button>
        <button className="bg-white/70 p-2 rounded-full hover:bg-white/90">
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
}
