import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, Pagination, Spin } from "antd";
import { AppDispatch, RootState } from "../app/store";
import { fetchUsers, reset } from "../features/users/userSlice";
import UserTable from "./table";
import { debounce } from "../utils/time";
const { Search } = Input;

import "./styles.css";

export const UserSearch: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.users.users);
  const totalCount = useSelector((state: RootState) => state.users.total_count);

  const status = useSelector((state: RootState) => state.users.status); // Get loading status

  const debouncedSearch = useCallback(
    debounce((searchTerm: string, page: number, size: number) => {
      if (searchTerm.length >= 3) {
        dispatch(fetchUsers({ query: searchTerm, page, per_page: size }));
      }
    }, 300),
    [dispatch]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setCurrentPage(1);
    if (value.length < 3) {
      dispatch(reset());
    }
    debouncedSearch(value, 1, pageSize);
  };

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) {
      setPageSize(size);
    }
    debouncedSearch(query, page, size || pageSize);
  };
  return (
    <div>
      <Search
        className="search"
        placeholder="Search GitHub Users"
        size="large"
        value={query}
        onChange={handleInputChange}
      />
      {status === "loading" ? (
        <div className="spinner">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <UserTable users={users} />
          <Pagination
            current={currentPage}
            total={totalCount}
            pageSize={pageSize}
            onChange={handlePageChange}
            style={{ marginTop: "20px" }}
          />
        </>
      )}
    </div>
  );
};
