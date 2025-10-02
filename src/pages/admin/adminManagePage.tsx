
import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminCompetitionsPage from "./adminCompetitionPage";
import AdminCodesPage from "./adminCodesPage";

// simple tailwind tab button
function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={
        "px-4 py-2 text-sm font-semibold rounded-t-xl border-b-2 " +
        (active
          ? "border-indigo-600 text-indigo-700 bg-white"
          : "border-transparent text-gray-600 hover:text-indigo-700 hover:bg-gray-50")
      }
    >
      {children}
    </button>
  );
}

function useTab(): [string, (t: "competitions" | "codes") => void] {
  const nav = useNavigate();
  const loc = useLocation();
  const params = new URLSearchParams(loc.search);
  const tab = (params.get("tab") || "competitions").toLowerCase();
  const setTab = (t: "competitions" | "codes") => {
    const p = new URLSearchParams(loc.search);
    p.set("tab", t);
    nav({ pathname: loc.pathname, search: p.toString() }, { replace: true });
  };
  return [tab, setTab];
}

const AdminManagePage: React.FC = () => {
  const [tab, setTab] = useTab();
  const isCompetitions = useMemo(() => tab !== "codes", [tab]); // default to competitions

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      {/* header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold">Admin</h1>
        <p className="text-sm text-gray-500">Manage competitions and upload/redeem codes.</p>
      </div>

      {/* tabs */}
      <div className="mb-0 flex gap-2 border-b">
        <Tab active={isCompetitions} onClick={() => setTab("competitions")}>Competitions</Tab>
        <Tab active={!isCompetitions} onClick={() => setTab("codes")}>Codes</Tab>
      </div>

      {/* content area */}
      <div className="rounded-b-2xl rounded-tr-2xl border border-t-0 bg-white">
        {/* Use padding wrapper so we don't touch child internals */}
        <div className="p-0">
          {isCompetitions ? (
            // show your existing page unchanged
            <AdminCompetitionsPage />
          ) : (
            <AdminCodesPage />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminManagePage;
