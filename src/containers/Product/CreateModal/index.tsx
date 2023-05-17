import { Button, Form, Input, Modal, Spin, UploadProps, message } from "antd";
import { ethers } from "ethers";
import React from "react";
import { getContract, useEth } from "../../../stores/eth/ethSlice";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";

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
  const [image, setImage] = React.useState<string | undefined>(undefined);

  const onFinish = async (values: CreateProduct) => {
    try {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = getContract();
      const res = await contract.addProduct(
        values.name,
        values.origin,
        image || "",
        {
          from: eth.account as string,
        }
      );

      await provider.waitForTransaction(res.hash);
      props.getProducts();
      props.onClose();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const uploadProps: UploadProps = {
    name: "file",
    multiple: true,
    // pinata
    action: "https://api.pinata.cloud/pinning/pinFileToIPFS",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        setImage(
          "https://gateway.pinata.cloud/ipfs/" + info.file.response.IpfsHash
        );
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
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

        <Dragger {...uploadProps} className="mb-4">
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibited from
            uploading company data or other banned files.
          </p>
        </Dragger>

        <div className="flex justify-end gap-2 pt-5">
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
