# Developer Notes

## Contents

1. [Database Time Zones](#database-time-zones)
2. [Flexbox and Absolute Positioned Children](#flexbox-and-absolute-positioned-children)
3. [PdfMake an Image Content Types](#pdfmake-and-image-content-types)
4. [NODE_ENV performance implications](#NODE-ENV-performance-implications)
5. [Cleaning up resources in React Components](#cleaning-up-resources-in-react-components)
6. [Form autocomplete](#form-autocomplete)

## Database Time Zones
All `date` data types in schema are set as `TIMESTAMP WITH TIME ZONE`, with entries being added as UTC in the following format `2017-05-15 12:24:56+00`. Without `TIME ZONE` added node servers will convert `date` data into js time objects in local time.

## Flexbox and Absolute Positioned Children
[As spelled out by w3](https://www.w3.org/TR/css-flexbox-1/#abspos-items), absolute positioned children of flex container parents will be positioned as though they are the sole flex item in the container. This can (and has) cause(d) some weirdness, so it's best to not use absolute positioning in children of flex-containers.

## PdfMake and Image Content Types
* Invalid PNG filters: https://github.com/bpampuch/pdfmake/issues/879
* Correctly base-64 encoding axios responses: https://github.com/axios/axios/issues/513

## NODE_ENV performance implications
* https://dynatrace.com/news/blog/the-drastic-effects-of-omitting-node_env-in-your-express-js-applications

## Cleaning up resources in React Components
Be careful to clean up after yourself! Temporary resources instantiated or used in a component should be deleted or cleaned up in the `componentWillUnmount` hook to prevent memory leaks and obscure errors.

**Example: Instascan scanner**
The instascan scanner activates a given camera and uses the media feed to detect QR codes. If a reference to an instance of `scanner` is left around while the camera is active, it will not be garbage collected, and continue to attempt to interact with elements that may have already been unmounted. In addition, the camera will remain active unnecessarily unless `scanner.stop` is called. This is what caused [issue #411](https://github.com/TwinePlatform/DataPower/issues/411).

## Form autocomplete
Attempting to disable autocomplete on input fields is basically ignored by all modern browsers.

See:
* https://developer.mozilla.org/en-US/docs/Web/Security/Securing_your_site/Turning_off_form_autocompletion
* https://caniuse.com/#search=autocomplete
