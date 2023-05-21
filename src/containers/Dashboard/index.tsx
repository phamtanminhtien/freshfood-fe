import React, { useEffect } from "react";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import { ProductStruct } from "../../types/contracts/FreshFood";
import { getContract, useEth } from "../../stores/eth/ethSlice";
import { Link } from "react-router-dom";

function Dashboard() {
  const [products, setProducts] = React.useState<ProductStruct[]>([]);

  useEffect(() => {
    if (eth) {
      getProducts();
    }
  }, []);

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

  return (
    <div className="container mx-auto grid grid-cols-4 gap-5 mt-5">
      {/* <div className="flex-1">
        <BarChart />
      </div> */}
      {products.map((product) => (
        <Link
          key={product.productId.toString()}
          className="col-span-1"
          to={`/v1/product/${product.productId.toString()}`}
        >
          <LineChart
            key={product.productId.toString()}
            productId={product.productId.toString()}
          />
        </Link>
      ))}
    </div>
  );
}

export default Dashboard;
