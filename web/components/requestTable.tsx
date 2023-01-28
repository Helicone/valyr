import { DocumentDuplicateIcon } from "@heroicons/react/24/solid";
import { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { truncString } from "../lib/stringHelpers";
import { Database } from "../supabase/database.types";
import { CSVDownloadButton } from "./csvDownload";

export type ResponseAndRequest = Omit<
  Database["public"]["Views"]["response_and_request"]["Row"],
  "response_body" | "request_body"
> & {
  response_body: {
    choices: any[] | null | undefined;
    usage:
      | {
          total_tokens: number;
        }
      | null
      | undefined;
  } | null;
  request_body: {
    prompt: string;
  } | null;
};

export interface DataTable {
  data: ResponseAndRequest[];
  probabilities: (String | undefined)[]; 
}

export function GetTableData({ client, limit }: { client: SupabaseClient, limit?: number }): DataTable {
  const [data, setData] = useState<ResponseAndRequest[]>([]);
  useEffect(() => {
    const fetch = async () => {

      var sql = client
        .from("response_and_request_rbac")
        .select("*")
        .order("request_created_at", { ascending: false });

      if (typeof limit !== "undefined") {
        sql.limit(limit);
      }

      const { data, error } = await sql;

      if (error) {
        console.log(error);
      } else {
        setData(data as ResponseAndRequest[]);
      }
    };
    fetch();
  }, [client]);
  console.log(data[0]);
  const probabilities = data.map((d) => {
    const choice = d.response_body?.choices
      ? d.response_body?.choices[0]
      : null;
    if (!choice) {
      return null;
    }

    var prob;
    if (choice.logprobs !== undefined && choice.logprobs !== null) {
      const tokenLogprobs = choice.logprobs.token_logprobs;
      const sum = tokenLogprobs.reduce(
        (total: any, num: any) => total + num,
        0
      );
      prob = sum.toFixed(2);
    } else {
      prob = "";
    }

    return prob;
  });

  const dataTable: DataTable = {
    data: data,
    probabilities: probabilities
  }

  return dataTable;
}

export function RequestTable({ client }: { client: SupabaseClient<Database> }) {
  const tableData = GetTableData({ client, limit: 100 });
  const data = tableData.data;
  const probabilities = tableData.probabilities;

  return (
    <div className="h-full">
      <div>
        <span>Showing the most recent {} </span>
        <span className="font-thin text-xs">(max 100)</span>
        <span className="text-right text-xs bottom-0" style={{float: "right"}}>
          <CSVDownloadButton client={client} />
        </span>
      </div>
      <div className="h-full overflow-y-auto mt-3">
        <table className="w-full mt-5 table-auto ">
          <thead>
            <tr className="text-slate-300">
              <th className="text-left">Time</th>
              <th className="text-left">Request</th>
              <th className="text-left">Response</th>
              <th className="text-left">Duration</th>
              <th className="text-left">Token Count</th>
              <th className="text-left">Log Probability</th>
              <th className="text-left">User Id</th>
              <th className="text-left">Copy</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr className="text-slate-300" key={row.request_id}>
                <td>{new Date(row.request_created_at!).toLocaleString()}</td>
                <td>
                  {row.request_body?.prompt
                    ? truncString(row.request_body.prompt, 15)
                    : "{{no prompt }}"}
                </td>
                <td>
                  {truncString(
                    row.response_body!.choices
                      ? row.response_body!.choices[0].text
                      : "{{ no reponse }}",
                    15
                  )}
                </td>
                <td>
                  {(
                    (new Date(row.response_created_at!).getTime() -
                      new Date(row.request_created_at!).getTime()) /
                    1000
                  ).toString()}{" "}
                  s
                </td>
                <td>
                  {row.response_body!.usage
                    ? row.response_body!.usage.total_tokens
                    : "{{ no tokens found }}"}
                </td>
                <td>{probabilities[i]}</td>
                <td>
                  {row.request_user_id && truncString(row.request_user_id, 5)}
                </td>
                <td>
                  <DocumentDuplicateIcon
                    className="h-5 w-5 text-slate-300 hover:cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(row));
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
