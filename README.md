# ts-mask
Typescript input mask

## Install

## Usegate

  ### Mask
  Mask is the mixed array of RegExp and strings<br />
  One item of array corresponds to one character of string.<br />

  ### Class
  Class constructor has got only two parameters:<br />
    input: HTMLInputElement<br />
    mask: (RegExp | string)[]<br />

## Example

component.html
```
<input type="text" id="text-input" />
```

component.ts
```
let phoneMask: (string | RegExp)[] = ['+','7',' ','(',/\d/,/\d/,/\d/,')',' ',/\d/,/\d/,/\d/,'-',/\d/,/\d/,/\d/,/\d/];

new TSMask(<HTMLInputElement>document.getElementById('text-input'), phoneMask);
```
