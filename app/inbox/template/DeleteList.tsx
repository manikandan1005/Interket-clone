"use client";

import { Badge} from "@chakra-ui/react";
import { Typography ,Table, Divider, Card, Tag } from "antd";

import { useState } from "react";

type ColumnType = {
  title: string;
  dataIndex: string;
  key: string;
  render?: (value: any, record: any) => React.ReactNode;
};

const DeleteTemplates = () => {
  const [template, setTemplate] = useState<any[]>([]);

  const columns: ColumnType[] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Template Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Language",
      dataIndex: "language",
      key: "language",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colorScheme =
          status === "APPROVED" ? "green" : "red";

        return (
          <Badge colorScheme={colorScheme}>
            {status?.toUpperCase()}
          </Badge>
        );
      },
    },
  ];

  return (
           <Card title="Delete Templates" style={{ marginTop: "10px" }}>
              <Table
                columns={columns}
                dataSource={template}
                rowKey="id"
                pagination={{ pageSize: 5 }}
              />
            </Card>
  );
};

export default DeleteTemplates;