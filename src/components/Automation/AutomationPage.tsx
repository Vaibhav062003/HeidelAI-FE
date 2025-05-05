import React, { useState } from "react";
import FlowBuilder from "./FlowBuilder";

const AutomationPage = () => {
  const [selectedTab, setSelectedTab] = useState("My Automations");
  const [showFlowBuilder, setShowFlowBuilder] = useState(false);

  const handleNewAutomation = () => setShowFlowBuilder(true);
  const handleCloseFlowBuilder = () => setShowFlowBuilder(false);

  return (
  <div className="flex h-[78vh] bg-gray-50">
    {/* Sidebar */}
      <div className="w-64 bg-white border-r p-6">
        <h2 className="text-lg font-semibold mb-6">Automation</h2>
        <div className="space-y-2">
          {["My Automations", "Basic", "Sequences"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`flex items-center w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                selectedTab === tab
                  ? "bg-gray-200 text-gray-900"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {showFlowBuilder ? (
          <FlowBuilder onClose={handleCloseFlowBuilder} />
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-semibold">{selectedTab}</h1>
              <button
                onClick={handleNewAutomation}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
              >
                + New Automation
              </button>
            </div>

            <div className="mb-8">
              <input
                type="text"
                placeholder="Search all Automations"
                className="w-full max-w-md border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              /> 
            </div>

            <div className="mb-8">
              <button
                onClick={() => alert("New Folder button clicked!")}
                className="border border-dashed border-blue-500 text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50"
              >
                + New Folder
              </button>
            </div>

            <div className="flex flex-col items-center justify-center bg-white rounded-lg p-12 shadow-sm">
              <div className="mb-6">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-4xl">✨</span>
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-4">
                Create your first Automation
              </h2>
              <p className="text-gray-500 text-center max-w-md mb-6 text-sm">
                Automations are where you create chat automations in an easy and
                visual format. Try some automations we recommend based on your
                goals.{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Learn more
                </a>
              </p>
              <button
                onClick={handleNewAutomation}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
              >
                + New Automation
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AutomationPage;