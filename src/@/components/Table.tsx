import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableRow } from "./ui/table";

type ApiResponse = Array<Record<string, string | number>>;

const DynamicTable = () => {
  const [apiUrl, setApiUrl] = useState<string>("");
  const [method, setMethod] = useState<string>("GET");
  const [headers, setHeaders] = useState<string>("");
  const [dataVariable, setDataVariable] = useState<string>("");
  const [dataType, setDataType] = useState<any>("Object");
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const handleApiCall = async () => {
    try {
      const parsedHeaders: Record<string, string> = headers
        ? JSON.parse(headers)
        : {};
      if (method !== "GET") {
        parsedHeaders["Content-Type"] = "application/json";
      }
      const response = await fetch(apiUrl, {
        method,
        headers: parsedHeaders,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (Array.isArray(data)) {
        setApiResponse(data);
      } else if (typeof data === "object") {
        setApiResponse([data]);
      } else {
        setApiResponse([]);
      }
    } catch (err) {
      setError(err as Error);
    }
  };

  const renderTableHeaders = () => {
    if (apiResponse && apiResponse.length > 0) {
      return Object.keys(apiResponse[0]).map((key, index) => (
        <TableCell key={index}>{key}</TableCell>
      ));
    }
    return null;
  };

  const renderTableRows = () => {
    if (apiResponse) {
      return apiResponse.map((item, index) => (
        <TableRow key={index}>
          {Object.values(item).map((value, i) => (
            <TableCell key={i}>
              {typeof value === "object" ? JSON.stringify(value) : value}
            </TableCell>
          ))}
        </TableRow>
      ));
    }
    return null;
  };

  return (
    <div>
      <h2>Dynamic Table</h2>
      <Label>Api Url</Label>
      <Input
        type="text"
        value={apiUrl}
        onChange={(e) => setApiUrl(e.target.value)}
      />
      <Label>Method</Label>
      <Select value={method} onValueChange={setMethod}>
        <SelectTrigger>
          <SelectValue>{method}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="GET">GET</SelectItem>
          <SelectItem value="POST">POST</SelectItem>
          <SelectItem value="PUT">PUT</SelectItem>
          <SelectItem value="DELETE">DELETE</SelectItem>
        </SelectContent>
      </Select>
      <Label>Headers</Label>
      <Input
        type="text"
        value={headers}
        onChange={(e) => setHeaders(e.target.value)}
      />
      {/* <Label>Data Variable</Label>
      <Input
        value={dataVariable}
        onChange={(e) => setDataVariable(e.target.value)}
      />
      <Label>Data Type</Label>
      <Select value={dataType} onValueChange={setDataType}>
        <SelectTrigger>
          <SelectValue>{dataType}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Array">Array</SelectItem>
          <SelectItem value="Object">Object</SelectItem>
        </SelectContent>
      </Select> */}
      <Button onClick={handleApiCall}>Fetch Api Response</Button>

      {apiResponse && Array.isArray(apiResponse) && (
        <Table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            marginTop: "20px",
          }}
        >
          <TableHead>
            <TableRow>{renderTableHeaders()}</TableRow>
            <TableBody>{renderTableRows()}</TableBody>
          </TableHead>
        </Table>
      )}

      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default DynamicTable;
