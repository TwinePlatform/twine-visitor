# Query Builder

`query_builder.js` allows you to dynamically build queries.

## selectQuery(table, columns, options)

### table - string 
Name of table in your database your want to access

### columns - array string
Array of column names you want returned. 

['*'] will return all columns
['user_name as user'] will return column as alias

### options - object

```
{
  where: { [column]: [value] string },
  between:  { column: [column] string, values: [value] array string }, 
  sort: [column] string, 
  pagination: { offset: [page number] int } 
}
```

options.where takes an object with key value pairs of columnName: value

options.between takes an object with keys of `column` and  `values`. `column` is string of column name, `values` is an array of two strings to search between

options.sort takes a string of column name you want to sort by

options.pagination takes an object with key `offset` which takes the page number currently displaying. This option also returns `full_count` which is a total lines of data from table.

