import React, { useMemo, useState } from "react";
import { JsonToTable } from "react-json-to-table";
import { Select } from "antd";
import Json2Chart from "../Json2Chart/Json2Chart";
import Scrollable from "../Scrollable";
import DataDownloader from "../DataDownloader/DataDownloader";
import isValidJson from "../../utils/isValidJson";

const dataTypeOptions = [
  {
    value: "json",
    label: "JSON",
  },
  {
    value: "raw",
    label: "RAW",
  },
];

const viewTypeOptions = [
  {
    value: "table",
    label: "TABLE",
  },
  {
    value: "chart",
    label: "CHART",
  },
];

const showTimeOptions = [
  {
    value: "yes",
    label: "YES",
  },
  {
    value: "no",
    label: "NO",
  },
];

const localTime = (timestamp) => {
  const utcDate = new Date(timestamp);
  return utcDate.toLocaleTimeString();
};

const DataViewer = ({ jsonData }) => {
  const [dataType, setDataType] = useState("json");
  const [viewType, setViewType] = useState("table");
  const [showTime, setShowTime] = useState("yes");

  const newJsonData = useMemo(() => {
    if (dataType === "json") {
      return jsonData
        .filter(({ timestamp, data }) => isValidJson(data))
        .map(({ timestamp, data }) => {
          return showTime === "yes"
            ? { timestamp: localTime(timestamp), ...JSON.parse(data) }
            : { ...JSON.parse(data) };
        });
    } else if (dataType === "raw") {
      if (showTime === "no") {
        return jsonData.map(({ timestamp, data }) => {
          return { data };
        });
      } else {
        return jsonData.map(({ timestamp, data }) => {
          return { timestamp: localTime(timestamp), data };
        });
      }
    }
  }, [dataType, jsonData, showTime]);

  return (
    <div>
      <div>
        <h3 style={{ display: "inline", paddingRight: "10px" }}>Data Type</h3>
        <Select
          defaultValue="json"
          style={{
            width: 100,
          }}
          onChange={(e) => setDataType(e)}
          options={dataTypeOptions}
        />
        <h3 style={{ display: "inline", padding: "0 10px" }}>View Type</h3>
        <Select
          defaultValue="table"
          style={{
            width: 100,
          }}
          onChange={(e) => setViewType(e)}
          options={viewTypeOptions}
          disabled={dataType === "raw"}
        />
        <h3 style={{ display: "inline", padding: "0 10px" }}>Timestamp</h3>
        <Select
          defaultValue="Yes"
          style={{
            width: 90,
          }}
          onChange={(e) => setShowTime(e)}
          options={showTimeOptions}
          disabled={viewType === "chart"}
        />
        <DataDownloader jsonData={newJsonData} />
      </div>

      <div style={{ margin: "10px 0" }}>
        <Scrollable height={"50px"}>
          {viewType === "table" && <JsonToTable json={newJsonData} />}
          {viewType === "chart" && <Json2Chart jsonData={newJsonData} />}
        </Scrollable>
      </div>
    </div>
  );
};

export default DataViewer;
