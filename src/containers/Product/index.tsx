import { ethers } from "ethers";
import React from "react";
import { getContract, useEth } from "../../stores/eth/ethSlice";
import { ProductStruct } from "../../types/contracts/FreshFood";
import { Card } from "./Card";
import CreateModal from "./CreateModal";
import ProductDetail from "./ProductDetail";

function Product() {
  const [products, setProducts] = React.useState<ProductStruct[]>([]);
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [productSelected, setProductSelected] = React.useState<string | null>(
    null
  );
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
    <div className="w-full grid grid-cols-4 container mx-auto min-h-[calc(100vh-60px)]">
      <CreateModal
        open={showModal}
        onClose={onClose}
        getProducts={getProducts}
      />
      <div className="col-span-1 gap-2 flex flex-col border-r px-2 pt-2">
        <div
          className="bg-gray-50/40 p-2 rounded-2xl shadow-lg flex justify-center items-center border-4 border-dashed text-gray-600 cursor-pointer"
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
              handleSelect={setProductSelected}
              key={ethers.utils.formatEther(product.productId.toLocaleString())}
              data={product}
            />
          );
        })}
      </div>
      <div className="col-span-2 border-r px-2">
        <ProductDetail id={productSelected as string} />
      </div>
      <div className="col-span-1 px-2"></div>
    </div>
  );
}

export default Product;
