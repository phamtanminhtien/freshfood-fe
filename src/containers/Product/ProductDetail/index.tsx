import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getContract, useEth } from "../../../stores/eth/ethSlice";
import { LogStruct, ProductStruct } from "../../../types/contracts/FreshFood";
import Log from "../Log";
import { TYPE_PERFORM } from "../../Tracking";
import {
  Dropdown,
  Form,
  Input,
  MenuProps,
  Modal,
  QRCode,
  Table,
  message,
} from "antd";
import { ColumnsType } from "antd/es/table";
import TableLog from "../Log/TableLog";
import { ethers } from "ethers";

type Props = {
  id?: string;
  reload?: number;
  typePerform?: TYPE_PERFORM;
  getProducts?: () => void;
};

function ProductDetail({
  id: idFromProps,
  reload,
  typePerform: _typePerform,
  getProducts,
}: Props) {
  const params = useParams<{ id: string }>();
  const id = idFromProps || params.id;
  const [product, setProduct] = React.useState<ProductStruct | null>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [typePerform, setTypePerform] = React.useState<TYPE_PERFORM>(
    _typePerform || "DRAW_LINE"
  );
  const eth = useEth();
  const [showTransferModal, setShowTransferModal] =
    React.useState<boolean>(false);
  const [addressTo, setAddressTo] = React.useState<string>("");

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
  if (product?.name.toString() === "")
    return (
      <div className="rounded bg-white p-2 w-full">
        <h1 className="text-2xl font-bold text-center py-5">
          Product not found
        </h1>
      </div>
    );

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <span
          className="flex items-center gap-2 text-base min-w-[200px]"
          onClick={() => {
            setShowTransferModal(true);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
            />
          </svg>
          Transfer
        </span>
      ),
    },
    {
      key: "2",
      label: (
        <span
          className="flex items-center gap-2 text-base min-w-[200px]"
          onClick={async () => {
            try {
              const contract = getContract();
              const tx = await contract.verifyProduct(id);
              await tx.wait();
              getProduct();
            } catch (error) {
              console.log(error);
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Verify
        </span>
      ),
    },
  ];

  return (
    <div className="rounded bg-white p-2 w-full container mx-auto">
      <Modal
        title="Transfer product"
        open={showTransferModal}
        onCancel={() => {
          setShowTransferModal(false);
        }}
        onOk={async () => {
          if (!addressTo) message.error("Please input address to!");
          else {
            const contract = getContract();
            const tx = await contract.transferProduct(id, addressTo);

            await tx.wait();
            getProducts && getProducts();
            setShowTransferModal(false);
            setAddressTo("");
          }
        }}
      >
        <Form layout="vertical">
          <Form.Item
            label="Address to"
            name="addressTo"
            rules={[{ required: true, message: "Please input address to!" }]}
          >
            <Input
              placeholder="Address to"
              value={addressTo}
              onChange={(e) => {
                setAddressTo(e.target.value);
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
      <div>
        <img
          src={product?.image.toString()}
          className="h-44 w-full object-cover rounded-2xl"
        />
        <div className="relative">
          <div className="absolute w-10 h-10 scale-[0.2] hover:scale-[1] hover:shadow-2xl transition cursor-pointer">
            <QRCode
              size={200}
              errorLevel="H"
              value={"https://freshfood.lalo.com.vn/tracking/" + id}
              icon="/src/assets/logo.png"
            />
          </div>

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

          <div className="absolute top-4 right-4 flex gap-3">
            <div className="rounded border flex gap-3 p-1">
              <div
                className={`cursor-pointer`}
                onClick={() => setTypePerform("TABLE")}
              >
                {typePerform === "TABLE" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1.5 5.625c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v12.75c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 18.375V5.625zM21 9.375A.375.375 0 0020.625 9h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zM10.875 18.75a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5zM3.375 15h7.5a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375zm0-3.75h7.5a.375.375 0 00.375-.375v-1.5A.375.375 0 0010.875 9h-7.5A.375.375 0 003 9.375v1.5c0 .207.168.375.375.375z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"
                    />
                  </svg>
                )}
              </div>

              <div
                className={`cursor-pointer`}
                onClick={() => setTypePerform("DRAW_LINE")}
              >
                {typePerform === "DRAW_LINE" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                    />
                  </svg>
                )}
              </div>
            </div>
            {!product?.verified && (
              <Dropdown
                trigger={["click"]}
                menu={{ items }}
                placement="bottomRight"
                arrow
              >
                <div className="rounded border flex gap-3 cursor-pointer p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                    />
                  </svg>
                </div>
              </Dropdown>
            )}
          </div>
        </div>

        <h2 className="text-xl text-center pb-5 text-gray-700">
          {product?.origin.toString()}
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        {typePerform === "DRAW_LINE" && (
          <>
            {product?.logList?.map((log, index) => {
              return (
                <Log
                  getProduct={getProduct}
                  key={index}
                  data={log}
                  id={id}
                  showCreate={
                    index === product?.logList.length - 1 && !product.verified
                  }
                />
              );
            }) || []}
          </>
        )}
        {typePerform === "TABLE" && <TableLog data={product?.logList} />}
      </div>
    </div>
  );
}

export default ProductDetail;
