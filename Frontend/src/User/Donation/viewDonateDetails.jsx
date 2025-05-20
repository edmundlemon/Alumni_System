import { useLocation } from "react-router-dom";
import { useState } from "react";

export default function ViewDonateDetails() {
  const { state } = useLocation();
  const donate = state?.dnt;
  return (
    <div
      style={{ backgroundImage: `url(${donate.image})` }}
      className="flex min-h-screen"
    >
      <h1 className="bg-[url({donate.image})] text-2xl">
        View Donation Details {donate.name}
      </h1>
    </div>
  );
}
