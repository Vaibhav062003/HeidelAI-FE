import React, { useState } from "react";

const AddProduct = ({ closeForm }) => {
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    images: "",
    name: "",
    on_sale: "True",
    permalink: "",
    price: "",
    product_id: "",
    purchasable: "True",
    regular_price: "",
    sale_price: "",
    slug: "",
    stock_quantity: "",
  });

  const [showForm, setShowForm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Product added successfully!");
        setShowForm(false);
        setFormData({
          category: "",
          description: "",
          images: "",
          name: "",
          on_sale: "True",
          permalink: "",
          price: "",
          product_id: "",
          purchasable: "True",
          regular_price: "",
          sale_price: "",
          slug: "",
          stock_quantity: "",
        });
        closeForm();
      } else {
        alert("Failed to add product. Please try again.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <form
        className="bg-gray-900 p-8 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-700"
        onSubmit={handleSubmit}
      >
        <h2 className="text-center text-2xl font-bold text-white mb-6">
          Add Product
        </h2>

        {Object.keys(formData).map((field) => (
          <div key={field} className="mb-5">
            <label className="block text-sm font-semibold text-gray-300 mb-2 capitalize">
              {field.replace(/_/g, " ")}
            </label>
            {field === "category" || field === "on_sale" || field === "purchasable" ? (
              <select
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {field === "category" ? (
                  <>
                    <option value="">Select Category</option>
                    <option value="electronics">Electronics</option>
                    <option value="gaming">Gaming</option>
                    <option value="fashion">Fashion</option>
                  </>
                ) : (
                  <>
                    <option value="True">True</option>
                    <option value="False">False</option>
                  </>
                )}
              </select>
            ) : field === "description" ? (
              <textarea
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              ></textarea>
            ) : (
              <input
                type={
                  field.includes("price") || field.includes("quantity")
                    ? "number"
                    : "text"
                }
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          className="bg-green-500 text-white px-5 py-3 rounded-lg w-full font-semibold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={closeForm}
          className="bg-red-500 text-white px-5 py-3 rounded-lg w-full font-semibold mt-3 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
