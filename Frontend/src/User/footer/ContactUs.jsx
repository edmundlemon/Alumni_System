import ContactImage from "../../assets/contact.png";
import { MdOutlineMail } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { MdOutlineLocationOn } from "react-icons/md";

export default function ContactUs() {
    return(
        <div className="mt-[130px] mb-[30px] mx-[120px]">
            <div className="flex flex-row justify-center h-[600px] gap-10">
                <div className="space-y-4">
                    <p className="text-xl font-semibold text-stone-500">How can we help you?</p>
                    <h1 className="text-4xl font-bold">Contact us</h1>
                    <p className="text-2xl pt-4 ">We’re here to help and answer any questions you might have. We look forward to hearing from you!</p>
                    <div className="space-y-2">
                        <div className="flex flex-row gap-2">
                            <p><FiPhone size={30} /></p>
                            <p className="text-xl"> +603-0000-0000</p>
                        </div>
                        <div className="flex flex-row gap-2">
                            <p className="text-xl"><MdOutlineMail size={30}/></p>
                            <p className="text-xl">mmu1@gmail.com</p>
                        </div>
                        <div className="flex flex-row gap-2 pb-4">
                            <p><MdOutlineLocationOn size={30} /></p>
                            <p className="text-xl"> Persiaran Multimedia, 63100 Cyberjaya, Selangor</p>
                        </div>
                        <div>
                        <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15938.441917421716!2d101.6419004!3d2.9277715!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cdb6e4a9d3b7a1%3A0xd0f74e8ad10f1129!2sMultimedia%20University%20-%20MMU%20Cyberjaya!5e0!3m2!1sen!2smy!4v1719150684413!5m2!1sen!2smy" width="480" height="215" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                        </div>
                    </div>
                </div>
                <div>
                    <img src={ContactImage} className="w-[1200px] h-[540px] rounded-lg" />
                </div>
            </div>
        </div>
    );
}