import React from 'react';

type Variable = {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'currency' | 'datetime';
  example: string;
  section: 'header' | 'body';
};

type VariableModalProps = {
  newVariable: Variable;
  setNewVariable: (variable: Variable) => void;
  setShowVariableModal: (show: boolean) => void;
  addVariable: () => void;
};

export const VariableModal: React.FC<VariableModalProps> = ({
  newVariable,
  setNewVariable,
  setShowVariableModal,
  addVariable,

}) => {


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Add {newVariable.section === 'header' ? 'Header' : 'Body'} Variable
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Variable Name
                </label>
                <input
                  type="text"
                  value={newVariable.name}
                  onChange={(e) => setNewVariable({ ...newVariable, name: e.target.value })}
                  placeholder="Enter variable name"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Variable Type
                </label>
                <select
                  value={newVariable.type}
                  onChange={(e) => setNewVariable({ ...newVariable, type: e.target.value as Variable['type'] })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Example Value
                </label>
                <input
                  type="text"
                  value={newVariable.example}
                  onChange={(e) => setNewVariable({ ...newVariable, example: e.target.value })}
                  placeholder="Enter example value"
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowVariableModal(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addVariable}
                disabled={!newVariable.name || !newVariable.example}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
              >
                Add Variable
              </button>
            </div>
          </div>
        </div>
  );
};