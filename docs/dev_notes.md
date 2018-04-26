# Developer Notes

## Contents

1. [Database Time Zones](#database-time-zones)
2. [Flexbox and Absolute Positioned Children](#flexbox-and-absolute-positioned-children)

## Database Time Zones
All `date` data types in schema are set as `TIMESTAMP WITH TIME ZONE`, with entries being added as UTC in the following format `2017-05-15 12:24:56+00`. Without `TIME ZONE` added node servers will convert `date` data into js time objects in local time.

## Flexbox and Absolute Positioned Children
[As spelled out by w3](https://www.w3.org/TR/css-flexbox-1/#abspos-items), absolute positioned children of flex container parents will be positioned as though they are the sole flex item in the container. This can (and has) cause(d) some weirdness, so it's best to not use absolute positioning in children of flex-containers.
