import { Button, DatePicker, Form, Input, Modal } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import "react-data-grid/lib/styles.css";
import DataGrid, { Column, textEditor } from "react-data-grid";
import { objectStoreService } from "../../../../services/objectStoreService";
import { getContract, useEth } from "../../../../stores/eth/ethSlice";
import { ethers } from "ethers";
import Create from "../Create";

type Props = {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  id: string;
  getProduct: () => void;
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
  return (
    <Modal
      title="Add to log"
      open={props.showModal}
      onCancel={() => props.setShowModal(false)}
      width={800}
      footer={null}
    >
      <Create
        id={props.id}
        getProduct={props.getProduct}
        finish={() => props.setShowModal(false)}
      />
    </Modal>
  );
}

export default CreateModal;
