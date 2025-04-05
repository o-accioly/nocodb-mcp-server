#!/usr/bin/env node
import {McpServer, ResourceTemplate} from "@modelcontextprotocol/sdk/server/mcp.js";
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import {z} from "zod";
import axios, {AxiosInstance} from "axios";

const {NOCODB_URL, NOCODB_API_TOKEN, NOCODB_BASE_ID} = process.env;
if (!NOCODB_URL || !NOCODB_API_TOKEN || !NOCODB_BASE_ID) {
    throw new Error("Missing required environment variables");
}

const nocodbClient: AxiosInstance = axios.create({
    baseURL: NOCODB_URL.replace(/\/$/, ""),
    headers: {
        "xc-token": NOCODB_API_TOKEN,
        "Content-Type": "application/json",
    },
    timeout: 30000,
});

export async function getRecords(tableName: string) {
    const tableId = await getTableId(tableName);
    const response = await nocodbClient.get(`/api/v2/tables/${tableId}/records`,);
    return response.data;
}

export async function postRecords(tableName: string, data: unknown) {
    const tableId = await getTableId(tableName);
    const response = await nocodbClient.post(`/api/v2/tables/${tableId}/records`, data);
    return {
        output: response.data,
        input: data
    };
}

export async function patchRecords(tableName: string, rowId: number, data: any) {
    const tableId = await getTableId(tableName);
    const newData = [{
        ...data,
        "Id": rowId,
    }]

    const response = await nocodbClient.patch(`/api/v2/tables/${tableId}/records`, newData);
    return {
        output: response.data,
        input: data
    };
}

export async function deleteRecords(tableName: string, rowId: number) {
    const tableId = await getTableId(tableName);
    const data: any =
        {
            "Id": rowId
        }
    const response = await nocodbClient.delete(`/api/v2/tables/${tableId}/records`, {data});
    return response.data;
}

const getTableId = async (tableName: string): Promise<string> => {
    try {
        const response = await nocodbClient.get(`/api/v2/meta/bases/${NOCODB_BASE_ID}/tables`);
        const tables = response.data.list || [];
        const table = tables.find((t: any) => t.title === tableName);
        if (!table) throw new Error(`Table '${tableName}' not found`);
        return table.id;
    } catch (error: any) {
        throw new Error(`Error retrieving table ID: ${error.message}`);
    }
};

export async function getListTables() {
    try {
        const response = await nocodbClient.get(`/api/v2/meta/bases/${NOCODB_BASE_ID}/tables`);
        const tables = response.data.list || [];
        return tables.map((t: any) => t.title);
    } catch (error: any) {
        throw new Error(`Error get list tables: ${error.message}`);
    }
}

// Create an MCP server
const server = new McpServer({
    name: "nocodb-mcp-server",
    version: "1.0.0"
});

async function main() {

    server.tool("nocodb-get-records",
        "Nocodb - Get Records",
        {tableName: z.string()},
        async ({tableName}) => {
            const response = await getRecords(tableName)
            return {
                content: [{
                    type: 'text',
                    mimeType: 'application/json',
                    text: JSON.stringify(response),
                }],
            }
        }
    );

    server.tool(
        "nocodb-get-list-tables",
        "Nocodb - Get List Tables",
        {},
        async () => {
            const response = await getListTables()
            return {
                content: [{
                    type: 'text',
                    mimeType: 'application/json',
                    text: JSON.stringify(response),
                }],
            }
        }
    )

    server.tool(
        "nocodb-post-records",
        "Nocodb - Post Records",
        {
            tableName: z.string().describe("table name"),
            data: z.any()
                .describe(`The data to be inserted into the table. 
[WARNING] The structure of this object should match the columns of the table.
example:
const response = await postRecords("Shinobi", {
        Title: "sasuke"
})`)
        },
        async ({tableName, data}) => {
            const response = await postRecords(tableName, data)
            return {
                content: [{
                    type: 'text',
                    mimeType: 'application/json',
                    text: JSON.stringify(response),
                }],
            }
        }
    );


    server.tool("nocodb-patch-records",
        "Nocodb - Patch Records",
        {
            tableName: z.string(),
            rowId: z.number(),
            data: z.any().describe(`The data to be updated in the table.
[WARNING] The structure of this object should match the columns of the table.
example:
const response = await patchRecords("Shinobi", 2, {
            Title: "sasuke-updated"
})`)
        },
        async ({tableName, rowId, data}) => {
            const response = await patchRecords(tableName, rowId, data)
            return {
                content: [{
                    type: 'text',
                    mimeType: 'application/json',
                    text: JSON.stringify(response),
                }],
            }
        }
    );

    server.tool("nocodb-delete-records",
        "Nocodb - Delete Records",
        {tableName: z.string(), rowId: z.number()},
        async ({tableName, rowId}) => {
            const response = await deleteRecords(tableName, rowId)
            return {
                content: [{
                    type: 'text',
                    mimeType: 'application/json',
                    text: JSON.stringify(response),
                }],
            }
        }
    );

    // Add a dynamic greeting resource
    server.resource(
        "greeting",
        new ResourceTemplate("greeting://{name}", {list: undefined}),
        async (uri, {name}) => ({
            contents: [{
                uri: uri.href,
                text: `Hello, ${name}!`
            }]
        })
    );

// Start receiving messages on stdin and sending messages on stdout
    const transport = new StdioServerTransport();
    await server.connect(transport);
}


void main();

