import { ethers } from "ethers";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getContract, useEth } from "../../stores/eth/ethSlice";
import { ProductStruct } from "../../types/contracts/FreshFood";
import { Card } from "./Card";
import CreateModal from "./CreateModal";
import ProductDetail from "./ProductDetail";
import Create from "./Log/Create";
import LineChart from "../Dashboard/LineChart";
import { Input, Select } from "antd";

const VERIFY_OPTIONS = [
  {
    label: "Verified",
    value: "verified" as const,
  },
  {
    label: "Not Verified",
    value: "not-verified" as const,
  },
];

const SEARCH_OPTIONS = [
  {
    label: "Name",
    value: "name" as const,
  },
  {
    label: "Origin",
    value: "origin" as const,
  },
];

function Product() {
  const [products, setProducts] = useState<ProductStruct[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [productSelected, setProductSelected] = useState<string | null>(null);
  const [reload, setReload] = useState<number>(1); // [1
  const eth = useEth();
  const [searchOption, setSearchOption] = useState<"name" | "origin">("name");
  const [filterVerify, setFilterVerify] = useState<
    "verified" | "not-verified" | null
  >(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getProducts = async () => {
    try {
      const contract = getContract();
      const products = await contract.getProductByOwner(eth.account as string);
      setProducts(products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProducts();
  }, [eth]);

  useEffect(() => {
    setProductSelected(products[0]?.productId.toString() || null);
  }, [products]);

  const onClose = () => {
    setShowModal(false);
  };

  const productFilter = useMemo(() => {
    if (!filterVerify) return products;
    return products.filter((product) => {
      if (filterVerify === "verified") return product.verified;
      return !product.verified;
    });
  }, [products, filterVerify]);

  const handleSearch = useCallback(
    async (value: string) => {
      setLoading(true);
      try {
        const contract = getContract();
        if (!value) {
          await getProducts();
          setLoading(false);
          return;
        }
        let filter: ProductStruct[] = [];
        if (searchOption === "name") {
          filter = await contract.getProductByName(value);
        } else {
          filter = await contract.getProductByOrigin(value);
        }

        setProducts(filter);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    },
    [eth, searchOption]
  );

  return (
    <div className="w-full grid grid-cols-4 container mx-auto h-[calc(100vh-60px)] overflow-hidden">
      <CreateModal
        open={showModal}
        onClose={onClose}
        getProducts={getProducts}
      />
      <div className="col-span-1 gap-2 flex flex-col border-r px-2 pt-2 h-[calc(100vh-60px)] overflow-auto">
        <div className="grid grid-cols-2 gap-2">
          <Input.Search
            onSearch={handleSearch}
            loading={loading}
            allowClear
            addonBefore={
              <Select
                className="col-span-1"
                options={SEARCH_OPTIONS}
                placeholder="Search by"
                value={searchOption}
                onChange={(value) => setSearchOption(value)}
              />
            }
            className="col-span-2"
            placeholder="Search"
          />

          <Select
            className="col-span-2"
            options={VERIFY_OPTIONS}
            placeholder="All"
            allowClear
            onChange={(value) => {
              setFilterVerify(value);
            }}
          />
        </div>
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
        {productFilter.map((product) => {
          return (
            <Card
              handleSelect={setProductSelected}
              key={ethers.utils.formatEther(product.productId.toLocaleString())}
              data={product}
            />
          );
        })}
      </div>
      <div className="col-span-2 border-r px-2 h-[calc(100vh-60px)] overflow-auto">
        <ProductDetail
          id={productSelected as string}
          reload={reload}
          getProducts={getProducts}
        />
      </div>
      <div className="col-span-1 px-2 h-[calc(100vh-60px)] overflow-auto pt-2">
        <LineChart productId={productSelected as string} reload={reload} />
        <Create
          disabled={
            !!products.find((i) => i.productId.toString() === productSelected)
              ?.verified
          }
          id={productSelected as string}
          getProduct={() => {
            setReload(reload + 1);
          }}
        />
      </div>
    </div>
  );
}

export default Product;
