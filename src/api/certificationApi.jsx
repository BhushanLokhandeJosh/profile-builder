import { createApi } from "@reduxjs/toolkit/query/react";
import {
  CERTIFICATE_LIST_ENDPOINT,
  CERTIFICATE_REDUCER_PATH,
  CREATE_CERTIFICATE_ENDPOINTS,
  HTTP_METHODS
} from "../Constants";
import axiosBaseQuery from "./axiosBaseQuery/service";

export const certificationApi = createApi({
  reducerPath: CERTIFICATE_REDUCER_PATH,
  baseQuery: axiosBaseQuery(),
  tagTypes: ["certificate"],
  endpoints: (builder) => ({
    createCertificate: builder.mutation({
      query: ({ profile_id, values }) => ({
        url: CREATE_CERTIFICATE_ENDPOINTS.replace(":profile_id", profile_id),
        method: HTTP_METHODS.POST,
        data: { certificates: values }
      }),
      invalidatesTags: ["certificate"],
      transformResponse: (response) => response.data
    }),
    getCertificates: builder.query({
      query: (profile_id) => ({
        url: CERTIFICATE_LIST_ENDPOINT.replace(":profile_id", profile_id)
      }),
      providesTags: ["certificate"],
      transformResponse: (response) => response.data.certificates
    })
  })
});

export const { useCreateCertificateMutation, useGetCertificatesQuery } =
  certificationApi;
