import { useState } from "react";
import { JsonToTable } from "react-json-to-table";
import { Input, Select, Button, Spin } from "antd";
import { useGetSerialDataQuery } from "../../services/serialDataApi";
import { useDispatch, useSelector } from "react-redux";
import { setConfig } from "./serialDataSlice";
import Scrollable from "../../components/Scrollable";

const InputGroup = Input.Group;
const Option = Select.Option;

export default function SerialDataPage() {
  const { query, options } = useSelector((state) => state.serialData);

  const dispatch = useDispatch();

  console.log(query, options);

  const [inputData, setInputData] = useState(query);

  const [inputOptions, setInputOptions] = useState(options);

  //const [query, setQuery] = useState({ inputData, inputOptions });

  const { data, error, isLoading, isFetching } = useGetSerialDataQuery(
    query,
    options
  );

  const onInputChange = (event = {}) => {
    const { name, value } = event?.target;
    setInputData((p) => {
      return {
        ...p,
        [name]: value,
      };
    });
  };

  const onSelectChange = (value) => {
    setInputData((p) => {
      return {
        ...p,
        datatype: value,
      };
    });
  };

  const onInputOptionChange = (event) => {
    const { name, value } = event.target;
    setInputOptions((p) => {
      return {
        ...p,
        [name]: Number(value) * 1000,
      };
    });
  };

  const requestSerialData = () => {
    dispatch(setConfig({ query: inputData, options: inputOptions }));
  };

  return (
    <div className="serial-data-test">
      <div className="serial-params-input">
        <div style={{ marginBottom: 16, display: "flex", gap: "5px" }}>
          <Input
            addonBefore="PORT"
            defaultValue={inputData.comport}
            name="comport"
            onChange={onInputChange}
            style={{ width: "200px" }}
          />
          <Input
            type="number"
            addonBefore="BaudRate"
            defaultValue={inputData.baudrate}
            name="baudrate"
            onChange={onInputChange}
            style={{ width: "200px" }}
          />
          <Select
            title="Data Type"
            defaultValue={inputData.datatype}
            name="datatype"
            onChange={onSelectChange}
          >
            <Option value="raw">Raw</Option>
            <Option value="json">JSON</Option>
          </Select>
          <Input
            type="number"
            min="5"
            addonBefore="Interval"
            addonAfter="Seconds"
            defaultValue={inputOptions.pollingInterval}
            name="pollingInterval"
            onChange={onInputOptionChange}
            style={{ width: "200px" }}
          />
          <Button type="primary" onClick={requestSerialData}>
            Request Data
          </Button>
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          margin: "50px",
          padding: "50px",
          display: `${isLoading || isFetching ? "block" : "none"}`,
        }}
      >
        {isFetching && (
          <>
            Fetching data...{" "}
            <Spin spinning={isFetching} percent={"auto"} delay="500" />
          </>
        )}
        {isLoading && (
          <>
            Loading data...{" "}
            <Spin spinning={isLoading} percent={"auto"} delay="500" />
          </>
        )}
      </div>
      <Scrollable height="260px">
        {(data || error) && !isFetching && !isLoading && (
          <>
            <JsonToTable json={data || error} />
          </>
        )}
      </Scrollable>
      {/* <Spin spinning={spinning} percent={percent} fullscreen delay="500" /> */}
    </div>
  );
}

//import React, { useState } from "react";
// import { useUpdatePostMutation } from "../services/serialdata";

// const JsonTable = () => {
//   const [updatePost, { data, error, isLoading }] = useUpdatePostMutation();
//   const [inputData, setInputData] = useState({
//     comport: "COM15",
//     baudrate: 9600,
//     datatype: "json",
//   });

//   const handlePostRequest = async () => {
//     try {
//       await updatePost(inputData).unwrap();
//     } catch (err) {
//       console.error("Failed to update post:", err);
//     }
//   };

//   return (
//     <div>
//       <button onClick={handlePostRequest} disabled={isLoading}>
//         {isLoading ? "Loading..." : "Send POST Request"}
//       </button>
//       {data && <div>Response: {JSON.stringify(data)}</div>}
//       {error && <div>Error: {JSON.stringify(error)}</div>}
//     </div>
//   );
// };

// export default JsonTable;
