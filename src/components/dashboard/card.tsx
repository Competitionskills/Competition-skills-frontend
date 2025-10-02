import React from "react";

type Props = {
  title: string;
  icon?: React.ReactNode;
  right?: React.ReactNode; // e.g. “Live” pill or metric switcher
  children: React.ReactNode;
};

const Card: React.FC<Props> = ({ title, icon, right, children }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-white font-semibold">{title}</h3>
        </div>
        {right ? <div className="flex items-center">{right}</div> : null}
      </div>

      <div className="p-6">{children}</div>
    </div>
  );
};

export default Card;
