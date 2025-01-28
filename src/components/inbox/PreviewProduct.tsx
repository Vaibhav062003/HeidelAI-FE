import React, { useState } from "react";

const ProductPreview = ({ product, onClose }) => {
  const fieldsToDisplay = [
    "name",
    "on_sale",
    "permalink",
    "price",
    "product_id",
    "purchasable",
    "regular_price",
    "sale_price",
    "slug",
    "stock_quantity",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Product Details</h2>
        <ul className="space-y-2">
          {fieldsToDisplay.map((field) => (
            <li key={field}>
              <strong className="capitalize">{field.replace(/_/g, " ")}: </strong>
              {product[field] || "N/A"}
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const ProductList = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Product List</h1>
      <table className="w-full border-collapse border border-gray-700">
        <thead>
          <tr className="bg-gray-700 text-white">
            <th className="border border-gray-600 px-4 py-2">Name</th>
            <th className="border border-gray-600 px-4 py-2">Category</th>
            <th className="border border-gray-600 px-4 py-2">Price</th>
            <th className="border border-gray-600 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index} className="hover:bg-gray-700">
              <td className="border border-gray-600 px-4 py-2">{product.name}</td>
              <td className="border border-gray-600 px-4 py-2">{product.category}</td>
              <td className="border border-gray-600 px-4 py-2">{product.price}</td>
              <td className="border border-gray-600 px-4 py-2">
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-all"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedProduct && (
        <ProductPreview
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default ProductList;
