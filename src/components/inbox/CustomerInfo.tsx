import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface CustomerInfoProps {
  name: string;
  email: string;
  billingaddress: string;
  shippingaddress: string;
  platform: string;
  selectedConversationId: string;
  saveCustomerInfo: (updatedData: {
    name: string;
    email: string;
    billingaddress: string;
    shippingaddress: string;
    gstin: string;
    phoneNumber: string;
    userId: string;
  }) => Promise<void>;
}

const CustomerInfo = ({
  name,
  email,
  billingaddress,
  shippingaddress,
  platform,
  selectedConversationId,
  saveCustomerInfo,
}: CustomerInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name,
    email,
    billingaddress,
    shippingaddress,
    gstin: "",
    phoneNumber: platform === "whatsapp" 
      ? selectedConversationId?.split("_")[1]?.replace(/^(\d{2})(\d+)/, "+$1 $2")
      : "",
    userId: platform !== "whatsapp"
      ? selectedConversationId?.split("_")[1] || ""
      : "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setFormData((prev) => ({
        ...prev,
        shippingaddress: prev.billingaddress,
      }));
    }
  };

  const handleSave = async () => {
    try {
      await saveCustomerInfo(formData); // Call the save function
      setIsEditing(false); // Exit editing mode
    } catch (error) {
      console.error("Failed to save customer info:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <Input
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <Input
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            readOnly={!isEditing}
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            User ID
          </label>
          <Input
            name="userId"
            value={formData.userId}
            onChange={handleInputChange}
            readOnly={!isEditing}
            placeholder="Enter platform user ID"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            GSTIN
          </label>
          <Input
            name="gstin"
            value={formData.gstin}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Billing Address
          </label>
          <Input
            name="billingaddress"
            value={formData.billingaddress}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Shipping Address
          </label>
          <Input
            name="shippingaddress"
            value={formData.shippingaddress}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
          {isEditing && (
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  onChange={handleCheckboxChange}
                />
                <span className="ml-2 text-sm text-gray-700">
                  Same as Billing Address
                </span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Buttons at the bottom-right */}
      <div className="flex justify-end gap-2 mt-6">
        {isEditing && (
          <Button variant="outline" onClick={handleSave}>
            Save
          </Button>
        )}
        <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>
    </div>
  );
};

export default CustomerInfo;