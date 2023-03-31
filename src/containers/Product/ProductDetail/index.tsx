import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getContract, useEth } from "../../../stores/eth/ethSlice";
import { ProductStruct } from "../../../types/contracts/FreshFood";
import Log from "../Log";

function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = React.useState<ProductStruct | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const eth = useEth();

  useEffect(() => {
    if (eth && id) {
      getProduct();
    }
  }, [eth]);

  const getProduct = async () => {
    try {
      setLoading(true);
      const contract = getContract();
      const product = await contract.getProduct(id);
      setProduct(product);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="rounded bg-white p-2 w-full">
      <h1 className="text-2xl font-bold text-center py-5">
        {product?.name.toString()}
      </h1>
      <div className="">
        {product?.logList.map((log, index) => {
          return (
            <Log
              key={index}
              data={log}
              showCreate={index === product?.logList.length - 1}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ProductDetail;
