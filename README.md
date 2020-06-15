# insomnia-plugin-param

[![NPM](https://img.shields.io/npm/v/insomnia-plugin-param.svg)](https://www.npmjs.com/package/insomnia-plugin-param)
[![CircleCI](https://circleci.com/gh/superruzafa/insomnia-plugin-param.svg?style=shield)](https://circleci.com/gh/superruzafa/insomnia-plugin-param)

An [Insomnia] plugin to ask values to the user when making requests.

This plugin works much like the Insomnia's built-in Prompt plugin but adds some
unique features, like asking for specific data type values or formatting those
values into several formats.

![Example](https://raw.githubusercontent.com/superruzafa/insomnia-plugin-param/master/images/example.png)

## Installation

Go to the [Param plugin page] at the [Plugin Hub] and install the plugin from there.

Additionally, in the [Insomnia] app go to `Preferences` > `Plugins` and install the
`insomnia-plugin-param`.

## Usage

Use the `Param` template tag in requests URLs, headers and bodies. Then click
on the tag and customize the parameter with the proper values.

![Param Template Tag](https://raw.githubusercontent.com/superruzafa/insomnia-plugin-param/master/images/template-tag.png)

## Types:

- `🔤 String`, accepts raw strings
- `*️⃣ Password`, same as previous but masking the input
- `🔢 Integer`, accepts raw integers
- `☑️ Boolean`, accepts boolean values
- `📅 Unix timestamp`, ask for timestamps and renders them as the
   number of seconds since the January 1st, 1970.
- `📅 Unix timestamp with milliseconds`, same as above but including milliseconds.
- `📅 ISO-8601`, same as above but format timestamps using the
   ISO-8601 standard.
- `🔗 URL`, accepts strings that are URLs
- `✉️ e-mail`, accepts e-Mail addresses
- `🖍 HTML Color`, accepts colors and renders the value using the HTML `#RRGGBB`
  color format.

## Name and description

The `Name` is an optional but recommendable field that gives the parameter with
a representative name of what it stands for.
Aditionally you can use the format `Name: Description` to give the users a better
explanation about the purpose of the parameter.

### Examples

With no value:

![Without name](https://raw.githubusercontent.com/superruzafa/insomnia-plugin-param/master/images/param-without-name.png)

With `Username`:

![Without name](https://raw.githubusercontent.com/superruzafa/insomnia-plugin-param/master/images/param-with-name.png)

With `Username: Enter here your Github username`:

![Without name](https://raw.githubusercontent.com/superruzafa/insomnia-plugin-param/master/images/param-with-name-and-desc.png)

## Control when the dialog is shown:

- `Ask always`, always shows an empty dialog
- `Ask always, but suggest the last entered value`, same as above
   but allows the user to reuse/modify the previous value.
- `Ask always, but suggest the default value`, same as above
  but presents the user the initial default value for the parameter.
- `Ask once, and use the value for further requests`, shows the
  dialog once and uses the entered value in the next requests
  until you close the Insomnia app.

## Parameter options

To be implemented

[Insomnia]: https://insomnia.rest
[Param plugin page]: https://insomnia.rest/plugins/insomnia-plugin-param
[Plugin Hub]: https://insomnia.rest/plugins
