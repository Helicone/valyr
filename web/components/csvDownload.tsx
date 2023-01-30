import { CSVDownload, CSVLink } from "react-csv";
import { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { GetTableData, ResponseAndRequest } from "./requestTable";

export function CSVDownloadButton({ client }: { client: SupabaseClient }) {
  const csvData = [
    ["firstname", "lastname", "email"],
    ["Ahmed", "Tomi", "ah@smthing.co.com"],
    ["Raed", "Labes", "rl@smthing.co.com"],
    ["Yezzi", "Min l3b", "ymin@cocococo.com"]
  ];

  const tableData = GetTableData({ client });

  const latency = tableData.data.map((d) => {
    const request = new Date(d.request_created_at!);
    const response = new Date(d.response_created_at!);
    return (response.getTime() - request.getTime()) / 1000;
  });

  const data = tableData.data.map((d, i) => {
    return {
      "request_id": d.request_id,
      "response_id": d.response_id,
      "time": d.request_created_at,
      "request": d.request_body?.prompt,
      "response": d.response_body?.choices[0]?.text,
      "duration (s)": latency[i],
      "token_count": d.request_body?.max_tokens,
      "logprobs": tableData.probabilities[i],
      "request_user_id": d.request_user_id,
      "model": d.request_body?.model,
      "temperature": d.request_body?.temperature,
    }
  })

  return <CSVLink
    data={data}
    filename={"requests.csv"}
    className="items-center px-4 btn btn-primary dark:bg-slate-800 rounded-full py-1 cursor-pointer"
    target="_blank"
  >
    Export to CSV
  </CSVLink>;
}