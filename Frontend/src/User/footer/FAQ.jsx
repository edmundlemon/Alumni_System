import { RiInformationLine, RiQuestionLine } from "react-icons/ri";
import { useState } from "react";

export default function FAQ() {
    const [openItems, setOpenItems] = useState({});

    const toggleItem = (index) => {
        setOpenItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const faqData = [
        {
            category: "General Privacy Questions",
            questions: [
                {
                    question: "What personal data does MMU collect from me?",
                    answer: "We collect information you provide through interactions with us, including your name, address, identity card/passport number, occupation, age, place of birth, contact details, photographs, and payment information for online transactions. We also collect information from your website usage."
                },
                {
                    question: "Why does MMU need my personal data?",
                    answer: "We process your personal data to provide better services, enhance your experience with our products and services, assess applications, manage student relationships, administer programs, and fulfill our legal obligations under Malaysian law."
                },
                {
                    question: "Is my personal data protected under Malaysian law?",
                    answer: "Yes, we take our responsibilities under the Malaysia Personal Data Protection Act 2010 (PDPA) seriously. You can learn more about PDPA at www.pdp.gov.my"
                }
            ]
        },
        {
            category: "Data Sharing & Disclosure",
            questions: [
                {
                    question: "Does MMU share my personal data with third parties?",
                    answer: "We do not share personal data with companies outside our Group except for purposes specified in our Privacy Notice. We may share data with our Group companies, service providers, educational institutions, and authorized third parties who help us provide our services."
                },
                {
                    question: "Who might MMU share my data with?",
                    answer: "We may share your data with our Group companies, agents, third-party service providers, credit agencies, debt collection agencies (in case of default), alumni networks, Yayasan Universiti Multimedia, and other educational institutions for verification purposes."
                },
                {
                    question: "Will my data be shared internationally?",
                    answer: "Yes, we may share your data with third parties overseas who provide data processing services, particularly for overseas exchange programs, internships, and other international activities."
                }
            ]
        },
        {
            category: "Student & Alumni Specific",
            questions: [
                {
                    question: "How is my data used as a prospective student?",
                    answer: "We use your data to assess applications, conduct background checks, process visa and scholarship applications, administer financial aid, manage student activities, and facilitate overseas programs."
                },
                {
                    question: "What happens to my data after I graduate?",
                    answer: "As an alumnus, your data helps us maintain lifelong relationships, provide alumni services, organize events, conduct research on alumni profiles, facilitate networking, and involve you in university development initiatives."
                },
                {
                    question: "Can MMU use my photos and videos for publicity?",
                    answer: "Yes, we may take and use photographs and videos during university events for publicity purposes. This is part of our standard data processing activities."
                }
            ]
        },
        {
            category: "Your Rights & Control",
            questions: [
                {
                    question: "How can I access my personal data held by MMU?",
                    answer: "You can request access to your personal data by contacting Mr Khairil Bin Anuar at smdservices@mmu.edu.my or calling 1 300 800 668 (MMU). We will provide the relevant data within a reasonable time."
                },
                {
                    question: "Can I correct my personal data if it's wrong?",
                    answer: "Yes, you can request corrections to your personal data. We will process your request after necessary verification and notify other organizations we've shared the data with within the past year."
                },
                {
                    question: "Can I withdraw my consent for data processing?",
                    answer: "Yes, you can withdraw your consent, but this may adversely impact your relationship with MMU and our Group. We will process withdrawal requests within a reasonable time."
                },
                {
                    question: "Are there fees for accessing or correcting my data?",
                    answer: "Requests for access or correction may be subject to fees and applicable provisions under the PDPA. Contact us for specific fee information."
                }
            ]
        },
        {
            category: "Data Security & Retention",
            questions: [
                {
                    question: "How does MMU protect my personal data?",
                    answer: "We use technical and physical security measures including SSL/TLS protocols, encryption, password protection, and secure storage technologies. However, we cannot guarantee protection against unauthorized access beyond our control."
                },
                {
                    question: "How long does MMU keep my personal data?",
                    answer: "We retain your data only for the period necessary to provide our services. If longer retention is needed, we will seek your consent unless extended retention is permitted by law."
                },
                {
                    question: "What happens to my data when MMU no longer needs it?",
                    answer: "We will destroy or anonymize your personal data when it's no longer needed for the original purpose or any legal/business requirements."
                }
            ]
        },
        {
            category: "Updates & Contact",
            questions: [
                {
                    question: "How will I know if the Privacy Notice changes?",
                    answer: "While we don't generally notify individual changes, the latest Privacy Notice is always available on MMU's website. You can also contact us directly to obtain the current version."
                },
                {
                    question: "Who can I contact for privacy-related questions?",
                    answer: "Contact Mr Khairil Bin Anuar at smdservices@mmu.edu.my or call 1 300 800 668 (MMU) for any privacy-related queries, complaints, or data requests."
                },
                {
                    question: "Does this Privacy Notice apply to all MMU services?",
                    answer: "This Privacy Notice applies to all MMU and Group services except those with separate privacy policies. It doesn't cover third-party services, advertisers, or external websites linked from our services."
                }
            ]
        }
    ];

    return (
        <div className="mb-[30px] mx-[120px]">
            <div className="mt-8 mb-[30px] mx-[120px]">
                <div className="flex flex-col">
                    <div className="pb-6">
                        <h1 className="text-3xl font-bold pb-6">Frequently Asked Questions - Privacy Policy</h1>
                        <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 flex items-center space-x-2">
                            <RiInformationLine className="h-5 w-5 text-blue-500" />
                            <span className="text-blue-700"><i>Based on MMU Privacy Policy last updated on 2nd June 2024</i></span>
                        </div>
                    </div>
                    
                    <div className="bg-white border shadow-xl py-4 px-14">
                        <div className="pt-4 pb-6">
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
                                <RiQuestionLine className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-amber-800 font-medium">Need More Help?</p>
                                    <p className="text-amber-700 text-sm mt-1">
                                        If your question isn't answered below, contact Mr Khairil Bin Anuar at{" "}
                                        <a href="mailto:smdservices@mmu.edu.my" className="underline">smdservices@mmu.edu.my</a>{" "}
                                        or call <strong>1 300 800 668 (MMU)</strong>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {faqData.map((category, categoryIndex) => (
                            <div key={categoryIndex} className="mb-8">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-200">
                                    {category.category}
                                </h2>
                                
                                <div className="space-y-3">
                                    {category.questions.map((item, questionIndex) => {
                                        const itemKey = `${categoryIndex}-${questionIndex}`;
                                        const isOpen = openItems[itemKey];
                                        
                                        return (
                                            <div key={questionIndex} className="border border-gray-200 rounded-lg">
                                                <button
                                                    onClick={() => toggleItem(itemKey)}
                                                    className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors"
                                                >
                                                    <span className="font-medium text-gray-800 pr-4">
                                                        {item.question}
                                                    </span>
                                                    <span className={`text-2xl text-gray-500 transition-transform ${isOpen ? 'rotate-45' : ''}`}>
                                                        +
                                                    </span>
                                                </button>
                                                
                                                {isOpen && (
                                                    <div className="px-4 pb-4 pt-1">
                                                        <div className="border-t border-gray-100 pt-3">
                                                            <p className="text-gray-700 leading-relaxed">
                                                                {item.answer}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h3 className="font-bold text-blue-800 mb-2">Important Legal Information</h3>
                                <p className="text-blue-700 text-sm leading-relaxed">
                                    This FAQ is provided for convenience and is based on our Privacy Policy. 
                                    For complete and authoritative information, please refer to the full 
                                    <a href="#" className="underline ml-1">Privacy Policy document</a>. 
                                    In case of any discrepancy, the Privacy Policy prevails.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}