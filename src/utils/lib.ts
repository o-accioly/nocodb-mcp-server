import axios, {AxiosInstance} from "axios";

const { NOCODB_URL, NOCODB_API_TOKEN, NOCODB_BASE_ID } = process.env;
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

export async function getRecordsNocoDb(tableName : string){
    const tableId = await getTableId(tableName);
    const response = await nocodbClient.get(`/api/v2/tables/${tableId}/records`, );
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