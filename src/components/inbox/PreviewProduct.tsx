import React from "react";

const ProductPreview = ({ product, onClose }) => {
  const fieldsToDisplay = [
    { key: "name", label: "Product Name" },
    { key: "on_sale", label: "On Sale" },
    { key: "price", label: "Price" },
    { key: "product_id", label: "Product ID" },
    { key: "purchasable", label: "Purchasable" },
    { key: "regular_price", label: "Regular Price" },
    { key: "sale_price", label: "Sale Price" },
    { key: "stock_quantity", label: "Stock Quantity" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Product Details</h2>
        <div className="space-y-4">
          <div className="flex justify-center">
            <img
              src={product.metadata.images}
              alt={product.metadata.name}
              className="w-32 h-32 object-cover rounded-md"
            />
          </div>
          <ul className="space-y-2">
            {fieldsToDisplay.map((field) => (
              <li key={field.key} className="flex justify-between">
                <strong className="text-gray-700">{field.label}:</strong>
                <span className="text-gray-900">
                  {product.metadata[field.key] || "N/A"}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-all w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ProductPreview;