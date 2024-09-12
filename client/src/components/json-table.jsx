import { useState } from "react";
import { JsonToTable } from "react-json-to-table";
import { Input, Select, Button } from "antd";
//import { useGetPokemonByNameQuery } from "./services/pokemon";
import { useGetSerialDataQuery } from "../services/serialdata";

const InputGroup = Input.Group;
const Option = Select.Option;

export default function JsonTable() {
  const [inputData, setInputData] = useState({
    comport: "COM15",
    baudrate: 9600,
    datatype: "json",
  });

  const { data, error, isLoading } = useGetSerialDataQuery(inputData);

  const onInputChange = (event = {}) => {
    //const { name, value } = event?.target;
    console.log(event);
  };

  return (
    <div className="serial-data-test">
      <div className="serial-params-input">
        <div style={{ marginBottom: 16, display: "flex", gap: "5px" }}>
          <Input
            addonBefore="PORT"
            defaultValue={inputData.comport}
            name="port"
            onChange={onInputChange}
            style={{ width: "200px" }}
          />
          <Input
            addonBefore="BaudRate"
            defaultValue={inputData.baudrate}
            name="baudrate"
            onChange={onInputChange}
            style={{ width: "200px" }}
          />
          <Select
            defaultValue={inputData.datatype}
            name="datatype"
            onChange={onInputChange}
          >
            <Option value="raw">Raw</Option>
            <Option value="json">JSON</Option>
          </Select>
          <Button type="primary">Request Data</Button>
        </div>
      </div>
      {error ? (
        <>
          Oh no, there was an error: {JSON.stringify(error)}
          <JsonToTable json={error} />
        </>
      ) : isLoading ? (
        <>Loading...</>
      ) : data ? (
        <>
          <JsonToTable json={error} />
        </>
      ) : null}
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
