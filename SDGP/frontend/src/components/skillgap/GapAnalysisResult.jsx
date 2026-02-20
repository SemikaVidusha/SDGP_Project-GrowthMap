import React, { useState } from "react";
import { Badge } from "../ui/badge";
import InstituteMapModal from "./InstituteMapModel";
import LocationDetector from "./LocationDetector";
import { SRI_LANKAN_INSTITUTIONS } from "../data/sriLankanInstitutions";

export default function GapAnalysisResult({ result, onReset }) {
  const [userLocation, setUserLocation] = useState(null);
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Filter institutions based on detected province
  const filteredInstitutions = userLocation
    ? SRI_LANKAN_INSTITUTIONS.filter(
        (inst) => inst.province === userLocation.province
      )
    : [];

  if (!result) return null;

  return (
    <div className="space-y-6">

      {/* Location Detector */}
      <LocationDetector onLocationDetected={setUserLocation} />

      {/* Gap Analysis Section */}
      <div className="p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4">Skill Gap Result</h2>

        <div className="space-y-2">
          {result.matchedSkills?.map((skill, index) => (
            <Badge key={index} className="mr-2 bg-green-100 text-green-800">
              {skill}
            </Badge>
          ))}
        </div>

        <div className="mt-4">
          <button
            onClick={onReset}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Recommended Institutions */}
      {userLocation && (
        <div className="p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">
            Recommended Institutions in {userLocation.province} Province
          </h2>

          {filteredInstitutions.length > 0 ? (
            <ul className="space-y-2">
              {filteredInstitutions.map((inst, index) => (
                <li
                  key={index}
                  className="p-3 bg-gray-100 rounded-lg flex justify-between items-center"
                >
                  <span>
                    {inst.name} – {inst.city}
                  </span>

                  <button
                    onClick={() => setIsMapOpen(true)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md"
                  >
                    View on Map
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No institutions found in your province.</p>
          )}
        </div>
      )}

      {/* Map Modal */}
      <InstituteMapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        institutions={filteredInstitutions}
      />
    </div>
  );
}