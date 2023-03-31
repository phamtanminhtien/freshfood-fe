import { Button, DatePicker, Form, Input, Modal } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import "react-data-grid/lib/styles.css";
import DataGrid, { Column, textEditor } from "react-data-grid";

type Props = {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
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

function CreateModal(props: Props) {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [rows, setRows] = useState<Row[]>([
    {
      stt: 1,
    },
  ]);

  const onClose = () => {
    props.setShowModal(false);
  };

  const onFinish = async (values: any) => {
    console.log({
      ...values,
      table: rows,
    });
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
    <Modal
      title="Add to log"
      open={props.showModal}
      onCancel={onClose}
      width={800}
      footer={null}
    >
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
              <DatePicker disabled className="w-full" />
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

        <div className="flex justify-end gap-2 mt-2">
          <Button type="default" onClick={onClose}>
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
