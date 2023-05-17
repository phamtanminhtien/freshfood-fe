import { Button, DatePicker, Form, Input, Modal } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import "react-data-grid/lib/styles.css";
import DataGrid, { Column, textEditor } from "react-data-grid";
import { objectStoreService } from "../../../../services/objectStoreService";
import { getContract, useEth } from "../../../../stores/eth/ethSlice";
import { ethers } from "ethers";

type Props = {
  id: string;
  getProduct: () => void;
  finish?: () => void;
};

type Row = {
  stt: number;
  name?: string;
  value?: string;
};

const columns: readonly Column<Row>[] = [
  {
    key: "stt",
    name: "STT",
    width: 50,
    resizable: true,
    cellClass: "text-center",
    headerCellClass: "text-center",
  },
  {
    key: "name",
    name: "Name",
    editor: textEditor,
    resizable: true,
    headerCellClass: "text-center",
  },
  {
    key: "value",
    name: "Value",
    editor: textEditor,
    resizable: true,
    headerCellClass: "text-center",
  },
];

function Create(props: Props) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Row[]>([
    {
      stt: 1,
      name: "temperature",
    },
    {
      stt: 2,
      name: "tumidity",
    },
    {
      stt: 3,
      name: "light",
    },
    {
      stt: 4,
      name: "soilMoisture",
    },
  ]);
  const eth = useEth();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const contract = getContract();
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const data = {
        ...values,
        table: rows.filter((row) => row.name && row.value),
      };
      const dataResult = await (await objectStoreService.post(data)).data;
      const res = await contract.addLog(
        props.id,
        dataResult._id,
        dataResult.hash,
        "",
        {
          from: eth?.account as string,
        }
      );

      await provider.waitForTransaction(res.hash);
      setLoading(false);
      props.getProduct();
      props.finish && props.finish();
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnRowsChange = (rows: Row[]) => {
    setRows(rows);
    if (rows.length > 0) {
      const lastRow = rows[rows.length - 1];
      if (lastRow.name && lastRow.value) {
        setRows([
          ...rows,
          {
            stt: rows.length + 1,
          },
        ]);
      }
    }
  };

  return (
    <Form
      initialValues={{
        date: dayjs(),
      }}
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      <div className="grid grid-cols-6 gap-2">
        <div className="col-span-3">
          <Form.Item
            label="Title"
            name="title"
            rules={[
              {
                required: true,
                message: "Please input title!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </div>

        <div className="col-span-3">
          <Form.Item
            label="Date"
            name="date"
            rules={[
              {
                required: true,
                message: "Please input date!",
              },
            ]}
          >
            <DatePicker
              format={"HH:mm DD/MM/YYYY"}
              disabled
              className="w-full"
            />
          </Form.Item>
        </div>
      </div>

      <div className="col-span-6">
        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              required: true,
              message: "Please input description!",
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
      </div>
      <div className="">
        <DataGrid
          rowKeyGetter={(row) => row.stt}
          columns={columns}
          rows={rows}
          onRowsChange={handleOnRowsChange}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="default"
          onClick={() => {
            props.finish && props.finish();
          }}
        >
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
  );
}

export default Create;
