import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBaseUrl } from "./httpDataSlice";
import { useGetHttpDataQuery } from "../../services/httpDataApi";
import { JsonToTable } from "react-json-to-table";
import { Button, Input } from "antd";
import Loading from "../../components/feedbacks/Loading";
import Scrollable from "../../components/Scrollable";

const HttpData = () => {
  const dispatch = useDispatch();
  const { baseUrl } = useSelector((state) => state.httpData);
  const { data, error, isLoading, isFetching, refetch } = useGetHttpDataQuery();

  const [inputData, setInputData] = useState(baseUrl);

  const handleChangeBaseUrl = () => {
    dispatch(setBaseUrl(inputData));
    refetch();
  };

  return (
    <div>
      <div className="input-div">
        <Input
          addonBefore="URL"
          type="text"
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          className="input-item"
        />
        <Button type="primary" onClick={handleChangeBaseUrl}>
          Fetch Data
        </Button>
      </div>
      <Loading isLoading={isLoading} isFetching={isFetching} />
      <Scrollable height={"260px"}>
        {error ? (
          <p>Error: {JSON.stringify(error)}</p>
        ) : (
          <JsonToTable json={data} />
        )}
      </Scrollable>
    </div>
  );
};

export default HttpData;
