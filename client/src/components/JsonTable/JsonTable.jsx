import React from "react";
import PropTypes from "prop-types";
import { JsonToTable } from "react-json-to-table";

const JsonTable = ({ jsonData }) => {
  const isValidJson = (data) => {
    try {
      JSON.parse(JSON.stringify(data));
      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <div>
      {isValidJson(jsonData) ? (
        <JsonToTable json={jsonData} />
      ) : (
        <pre>{JSON.stringify(jsonData, null, 2)}</pre>
      )}
    </div>
  );
};

JsonTable.propTypes = {
  jsonData: PropTypes.any.isRequired,
};

export default JsonTable;
