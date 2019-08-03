//#region reuires
const cheerio = require("cheerio");
const request = require("request-promise");
const express = require("express");
const urlify = require ("urlify").create({
  addEToUmlauts:true,
  szToSs :true,
  spaces:"+",
  nonPrintable:"_",
  trim:true
});
const urlify3 = require ("urlify").create({
  addEToUmlauts:true,
  szToSs :true,
  spaces:"%26",
  nonPrintable:"_",
  trim:true
});
//#endregion
//#region tanimlar
(async () => {
  const arama="bebek bezi";
  const urlarama=urlify(arama);
  const url = "https://www.happycenter.com.tr/Product/Search/?ara="+urlarama;
  const response = await request(url);
  const $ = cheerio.load(response);
  let sonuclar = [];
  let sonuclarson = [];
  let sonuclarFiyat = [];
  var jsonSonuclar = {};
  let fiyat;
  let search;
  
  //#endregion
//#region happy center
  const urlElems = $(
    "#product-grid-list > div.panel-body > div> div"
  );

  for (let i = 2; i <= urlElems.length; i++) {
    search = $(
      "#product-grid-list > div.panel-body > div > div:nth-child(" +
      [i] +
      ") > p:nth-child(2) > a"
    )
    .text()
    .trim()
    .replace("\n", "");

    fiyat = $(

      "#product-grid-list > div.panel-body > div > div:nth-child(" +
      [i] +
      ") > p:nth-child(3) > span"
    )
      .text()
      .trim()
      .replace("\n", "")
      .replace(" TL", "")
      .replace("                                  \n                ", "")
      .replace(" TL", "")
      .substr(-6);

    jsonSonuclar = {
      site: "happycenter",
      name: search,
      Price: parseFloat(fiyat.replace(",", "."), 10)
    };

    sonuclar.push(jsonSonuclar);
  }
  //#endregion

sonuclar.sort(function(a, b) {
    return a.Price - b.Price;
  });
 
 
console.log(sonuclar);
})();                      //   async satırının sonu silme

//#region express
const app = express();
app.get("/", (req, res) => {
  res.send("test");
});
const port = process.env.port || 8080;
app.listen(port);
//#endregion
