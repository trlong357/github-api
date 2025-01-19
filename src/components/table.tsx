import React from "react";
import { Table, Avatar } from "antd";

interface User {
  id: number;
  avatar_url: string;
  login: string;
  type: string;
  score: number;
}

interface UserTableProps {
  users: User[];
}

const UserTable: React.FC<UserTableProps> = ({ users }) => {
  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatar_url",
      key: "avatar",
      render: (avatar_url: string) => <Avatar src={avatar_url} size="large" />,
    },
    {
      title: "Username",
      dataIndex: "login",
      key: "username",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      render: (score: number) => score.toFixed(2),
    },
  ];

  return (
    <Table
      pagination={false}
      dataSource={users}
      columns={columns}
      rowKey="id"
    />
  );
};

export default UserTable;
