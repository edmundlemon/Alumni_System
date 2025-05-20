import { useState } from "react"
import Select from 'react-select';
import { RxImage } from "react-icons/rx";
import { IoMdAdd } from "react-icons/io";

export default function AddEvent() {
    const eventType = [
        {value:"Hybrid", label:"Hybrid"},
        {value:"Online", label:"Online"},
        {value:"Offline", label:"Offline"},    
    ];
    return(
        <section className="min-h-screen mx-80 my-10 rounded shadow border border-gray-200">
            <div className="px-10 py-6 w-full">
                <h1 className="uppercase text-4xl font-semibold">Create Event</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
                    <div className="flex flex-col">
                        <label htmlFor="Title" className="text-lg font-medium text-gray-700">Event Title</label>
                        <input 
                            type="text" 
                            name="Title" 
                            id="eTitle"
                            placeholder="Enter Event Title"
                            required 
                            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="eventType" className="text-lg font-medium text-gray-700">Event Type</label>
                        <Select
                            options={eventType}
                            placeholder="Select Event Type"
                            className="mt-1"
                        />
                    </div>
                </div>
                <div className="mt-5 flex flex-col gap-1">
                    <label htmlFor="image" className="text-lg font-medium text-gray-700">Upload Images</label>
                    <div className="flex gap-2">
                        <div className="w-2/3 flex text-gray-400 gap-2 flex-col items-center h-56 justify-center border-2 border-dashed border-gray-300 rounded-md p-4">
                            <RxImage className=" w-28 h-28"/>
                            <p className="font-medium text-lg">Upload Event Image</p>
                        </div>
                        <div className="w-1/3 flex text-lg font-medium text-gray-500 gap-2 items-center h-56 justify-center">
                            <IoMdAdd size={25}/> Upload Event Image
                        </div>
                    </div>
                </div>
                <div className="mt-5 flex flex-col gap-1">
                    <label htmlFor="description" className="font-medium text-lg text-gray-700">Description</label>
                    <textarea name="description" 
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={5}
                    ></textarea>
                </div>
            </div>
        </section>
    )
}