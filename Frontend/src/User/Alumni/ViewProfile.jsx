import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function ViewProfile() {
    const { state } = useLocation();
    const alumni = state?.alumni;
    return(
        <section >
            <div className="w-full h-96 bg-blue-900">
                <div className="flex px-20 w-full">
                    
                </div>
            </div>
        </section>
    )
}