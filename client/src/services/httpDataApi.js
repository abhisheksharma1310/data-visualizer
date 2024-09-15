import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const dynamicBaseQuery = async (args, api, extraOptions) => {
  const state = api.getState();
  const baseUrl = state.httpData.baseUrl;
  const rawBaseQuery = fetchBaseQuery({ baseUrl });
  return rawBaseQuery(args, api, extraOptions);
};

export const httpDataApi = createApi({
  reducerPath: "httpDataApi",
  baseQuery: dynamicBaseQuery,
  endpoints: (builder) => ({
    getHttpData: builder.query({
      query: (params) => ({
        url: "",
        params,
      }),
    }),
  }),
});

export const { useGetHttpDataQuery } = httpDataApi;
