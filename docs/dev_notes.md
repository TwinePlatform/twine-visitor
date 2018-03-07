# Developer Notes

## Contents

[Database Schema Woes](#database-schema-woes)

## Database Schema Woes

All `date` data types in schema are set as `TIMESTAMP WITH TIME ZONE`, with entries being added as UTC in the following format `2017-05-15 12:24:56+00`. Without `TIME ZONE` added node servers will convert `date` data into js time objects in local time.
