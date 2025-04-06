## API Functions

### 1. Fetch Records

Retrieve data from a specified Nocodb table.

```typescript
const records = await getRecords("Shinobi");
```

### 2. Create Record

Create a new record in a specified Nocodb table.

```typescript
const response = await postRecords("Shinobi", {
        Title: "sasuke"
    }
)
``` 

### 3. Update Record

Update an existing record in a specified Nocodb table.

```typescript
const response = await updateRecords("Shinobi", {
        Title: "naruto",
        id: 1
    }
)
```

### 4. Delete Record

Delete a record from a specified Nocodb table.

```typescript
const response = await deleteRecords("Shinobi", {
        id: 1
    }
)
```

### 5. Get Table Names

Retrieve the names of all tables in the Nocodb database.

```typescript
const tableNames = await getTableNames();
```

### 6. Add Column

Add a new column to a specified Nocodb table.

```typescript
const response = await addColumn("Shinobi", {
        name: "Age",
        type: "Number"
    }
)
```

### 7. Get Table Metadata

Retrieve metadata for a specified Nocodb table.

```typescript
const metadata = await getTableMetadata("Shinobi");
```

### 8. Delete Column

Delete a column from a specified Nocodb table.
Column input is columnId

```typescript
const response = await deleteColumn("c7uo2ruwc053a3a")
```

