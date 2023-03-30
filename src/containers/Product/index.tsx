import { ethers } from "ethers";
import React from "react";
import { getContract, useEth } from "../../stores/eth/ethSlice";
import { ProductStruct } from "../../types/contracts/FreshFood";
import { Card } from "./Card";
import CreateModal from "./CreateModal";

function Product() {
  const [products, setProducts] = React.useState<ProductStruct[]>([]);
  const [showModal, setShowModal] = React.useState(false);
  const eth = useEth();
  const getProducts = async () => {
    try {
      const contract = getContract();
      const products = await contract.getProductByOwner(eth.account as string);

      setProducts(products);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getProducts();
  }, [eth]);

  const onClose = () => {
    setShowModal(false);
  };
  return (
    <div className="w-full grid grid-cols-4 gap-2">
      <CreateModal
        open={showModal}
        onClose={onClose}
        getProducts={getProducts}
      />
      <div
        className="bg-gray-50/40 p-3 rounded-2xl shadow-lg flex justify-center items-center border-4 border-dashed text-white cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-14 h-14"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </div>
      {products.map((product) => {
        return (
          <Card
            key={ethers.utils.formatEther(product.productId.toLocaleString())}
            data={product}
          />
        );
      })}
    </div>
  );
}

export default Product;
