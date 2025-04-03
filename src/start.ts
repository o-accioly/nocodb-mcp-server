import {McpServer, ResourceTemplate} from "@modelcontextprotocol/sdk/server/mcp.js";
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {getRecordsNocoDb} from "./utils/lib";

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
            const response = await getRecordsNocoDb(tableName)
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

