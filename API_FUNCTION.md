
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
