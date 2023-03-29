import { Button, Form, Input, Modal, notification, Steps } from "antd";
import React from "react";
import {
  getContract,
  setOwnerInfo,
  setState,
  useEth,
} from "../stores/eth/ethSlice";
import {
  UserOutlined,
  SolutionOutlined,
  LoadingOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";

type FromProps = {
  name: string;
  description: string;
};

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

function RegisterModal(props: Props) {
  const eth = useEth();
  const [form] = Form.useForm<FromProps>();
  const [loading, setLoading] = React.useState(false);
  const contract = getContract();
  const dispatch = useDispatch();

  const handleSubmit = async (value: FromProps) => {
    try {
      setLoading(true);
      await contract?.registerOwner(value.name, value.description, {
        from: eth.account as string,
      });
      const owner = await contract?.getOwner({
        from: eth.account as string,
      });
      if (!owner) throw new Error("Owner not found");

      dispatch(setOwnerInfo(owner));
      props.setOpen(false);
      setLoading(false);
    } catch (error: any) {
      console.log(error);
      notification.error({
        message: "Error",
        description: error.message,
      });
    }
  };

  return (
    <Modal
      open={props.open}
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
              <Input />
            </Form.Item>
            <Form.Item
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              name="description"
              label="Description"
              rules={[
                {
                  required: true,
                  message: "Please input your description!",
                },
              ]}
            >
              <Input.TextArea />
            </Form.Item>
          </div>

          <div className="flex justify-end">
            <Form.Item>
              <Button type="primary" htmlType="submit">
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
