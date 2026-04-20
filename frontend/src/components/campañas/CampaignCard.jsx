import React from "react";

export default function CampaignCard({ campaign, onView, onDelete }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 border">
      <h2 className="text-xl font-bold">{campaign.title}</h2>
      <p className="text-gray-600">{campaign.description}</p>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onView(campaign)}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Ver
        </button>

        <button
          onClick={() => onDelete(campaign.id)}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}