import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const serialDataApi = createApi({
  reducerPath: "serialDataApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/serial/" }),
  endpoints: (builder) => ({
    getSerialData: builder.query({
      query: (params) => ({
        url: `data`,
        params,
      }),
    }),
  }),
});

export const { useGetSerialDataQuery } = serialDataApi;
