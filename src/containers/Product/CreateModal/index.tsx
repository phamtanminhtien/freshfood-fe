import { Button, Form, Input, Modal, Spin } from "antd";
import { ethers } from "ethers";
import React from "react";
import { getContract, useEth } from "../../../stores/eth/ethSlice";

type Props = {
  open: boolean;
  onClose: () => void;
  getProducts: () => void;
};

type CreateProduct = {
  name: string;
  origin: string;
};

function CreateModal(props: Props) {
  const [form] = Form.useForm<CreateProduct>();
  const eth = useEth();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: CreateProduct) => {
    try {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = getContract();
      const res = await contract.addProduct(values.name, values.origin, {
        from: eth.account as string,
      });

      await provider.waitForTransaction(res.hash);
      props.getProducts();
      props.onClose();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create Product"
      open={props.open}
      onCancel={props.onClose}
      width={800}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input product name!",
            },
          ]}
        >
          <Input type="text" />
        </Form.Item>
        <Form.Item
          label="Origin"
          name="origin"
          rules={[
            {
              required: true,
              message: "Please input product origin!",
            },
          ]}
        >
          <Input type="text" />
        </Form.Item>

        <div className="flex justify-end gap-2">
          <Button type="default" onClick={props.onClose}>
            Cancel
          </Button>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={loading}
            >
              Create
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}

export default CreateModal;
