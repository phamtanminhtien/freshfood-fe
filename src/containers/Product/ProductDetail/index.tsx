import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getContract, useEth } from "../../../stores/eth/ethSlice";
import { ProductStruct } from "../../../types/contracts/FreshFood";
import Log from "../Log";

type Props = {
  id?: string;
  reload?: number;
};

function ProductDetail({ id: idFromProps, reload }: Props) {
  const params = useParams<{ id: string }>();
  const id = idFromProps || params.id;
  const [product, setProduct] = React.useState<ProductStruct | null>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const eth = useEth();

  useEffect(() => {
    if (eth && id) {
      getProduct();
    }
  }, [eth, id, reload]);

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

  if (loading)
    return (
      <div className="rounded bg-white p-2 w-full">
        <h1 className="text-2xl font-bold text-center py-5">Loading...</h1>
      </div>
    );

  return (
    <div className="rounded bg-white p-2 w-full container mx-auto">
      <div>
        <img
          src={product?.url.toString()}
          className="h-44 w-full object-cover rounded-2xl"
        />
        <h1 className="text-2xl font-bold text-center pt-2 flex gap-2 justify-center items-center">
          #{product?.productId.toString()} {product?.name.toString()}
          {product?.verified && (
            <span className="text-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          )}
        </h1>
        <h2 className="text-xl text-center pb-5 text-gray-700">
          {product?.origin.toString()}
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        {product?.logList.map((log, index) => {
          return (
            <Log
              getProduct={getProduct}
              key={index}
              data={log}
              id={id}
              showCreate={index === product?.logList.length - 1}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ProductDetail;
