import {
  LoadingOutlined,
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Modal, notification, Steps } from "antd";
import { ethers } from "ethers";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { getContract, setEthState, useEth } from "../stores/eth/ethSlice";

type FromProps = {
  name: string;
  email: string;
};

function RegisterModal() {
  const eth = useEth();
  const [form] = Form.useForm<FromProps>();
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    async (value: FromProps) => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = getContract();
      setLoading(true);
      const res = await contract.registerOwner(value.name, value.email, {
        from: eth.account as string,
      });
      await provider.waitForTransaction(res.hash);
      const owner = await contract.getOwner({
        from: eth.account as string,
      });
      dispatch(setEthState({ ownerInfo: owner, isLoading: false }));
      try {
      } catch (error: any) {
        console.error(error);
        notification.error({
          message: "Error",
          description: error.message,
        });
      }
    },
    [eth.account]
  );

  return (
    <Modal
      closable={false}
      open={!eth.ownerInfo?.name && !eth.isLoading}
      width={700}
      title="Verification is in progress"
      footer={null}
    >
      <Steps
        items={[
          {
            title: "Connect",
            status: "finish",
            icon: <UserOutlined />,
          },
          {
            title: "Login",
            status: "finish",
            icon: <SolutionOutlined />,
          },
          {
            title: "Verification",
            status: "process",
            icon: <LoadingOutlined />,
          },
          {
            title: "Done",
            status: "wait",
            icon: <SmileOutlined />,
          },
        ]}
      />

      <div className="">
        <h2 className="pt-10 flex justify-center items-center text-4xl gap-2 font-bold">
          <UserOutlined /> Owner Information
        </h2>
        <Form form={form} onFinish={handleSubmit}>
          <div className="py-10">
            <Form.Item
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                  message: "Please input your name!",
                },
              ]}
            >
              <Input type="text" placeholder="Name" />
            </Form.Item>
            <Form.Item
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
              ]}
            >
              <Input type="email" placeholder="Email" />
            </Form.Item>
          </div>

          <div className="flex justify-end">
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={loading}
              >
                Submit
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </Modal>
  );
}

export default RegisterModal;
