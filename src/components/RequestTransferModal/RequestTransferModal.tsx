import { Modal } from "antd";
import React, { useState } from "react";
import { getContract, useEth } from "../../stores/eth/ethSlice";
import ProductDetail from "../../containers/Product/ProductDetail";
import { Link, useHistory } from "react-router-dom";
import { ethers } from "ethers";
import dayjs from "dayjs";

type Props = {
  to: string;
  productId: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

function RequestTransferModal({ to, visible, productId, setVisible }: Props) {
  const history = useHistory();
  const eth = useEth();
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    try {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = getContract();
      const res = await contract.transferProduct(productId, to);
      await provider.waitForTransaction(res.hash);
      setVisible(false);
      history.push("/v1/home");
      setShowProductDetail(false);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      className="z-[10000]"
      onCancel={() => setVisible(false)}
      title="Request Transfer"
      open={visible}
      onOk={handleOk}
      width={1000}
      okButtonProps={{ loading, disabled: loading }}
    >
      <div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="font-bold">From:</div>
            <div>{eth.account}</div>
          </div>
          <div className="flex gap-2">
            <div className="font-bold">To:</div>
            <div>{to}</div>
          </div>
          <div className="flex gap-2">
            <div className="font-bold">ProductId:</div>
            <div>#{productId}</div>
            <div
              className="text-blue-500 cursor-pointer"
              onClick={() => setShowProductDetail(true)}
            >
              View Product
            </div>
          </div>
        </div>
        <div>
          {showProductDetail && (
            <ProductDetail id={productId} typePerform="TABLE" />
          )}
        </div>
      </div>
    </Modal>
  );
}

export default RequestTransferModal;
