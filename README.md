# ps4-pkg-info

Read information from PS4 pkg files

## Installation:

```
npm install --save ps4-pgk-info
```
  
## Usage example:

```javascript
const pkgInfo = require("ps4-pkg-info");

let file = "/home/myuser/myfile.pkg";

pkgInfo.extract(file).then(data => {
    console.log(data)
}).catch(error => {
    console.error(error)
});
```

## Contributing

If you have anything to contribute, or functionality that you lack - you are more than welcome to participate in this!
If anyone wishes to contribute unit tests - that also would be great :-)


## Help

If you want to buy me a beer or a coffe, you are very welcome to
[![Donate](https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=P7Z827QS4ET5U&currency_code=EUR&source=url)
 Thanks :-)


## Acknowledgements
PS4 pkg info is based on:
- *pkg_tools,(public edition),  [(c) n1ghty](https://github.com/n1ghty/pkg_tools)
- *UnPKG rev 0x00000008 (public edition), (c) flatz*