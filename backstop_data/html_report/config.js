report({
  "testSuite": "BackstopJS",
  "tests": [
    {
      "pair": {
        "reference": "..\\bitmaps_reference\\web-pres-lieb_Landing_Page_0_document_0_desktop.png",
        "test": "..\\bitmaps_test\\20250718-141657\\web-pres-lieb_Landing_Page_0_document_0_desktop.png",
        "selector": "document",
        "fileName": "web-pres-lieb_Landing_Page_0_document_0_desktop.png",
        "label": "Landing Page",
        "requireSameDimensions": true,
        "misMatchThreshold": 0.1,
        "url": "http://localhost:5173",
        "expect": 0,
        "viewportLabel": "desktop",
        "diff": {
          "isSameDimensions": true,
          "dimensionDifference": {
            "width": 0,
            "height": 0
          },
          "rawMisMatchPercentage": 6.075390625000001,
          "misMatchPercentage": "6.08",
          "analysisTime": 39
        },
        "diffImage": "..\\bitmaps_test\\20250718-141657\\failed_diff_web-pres-lieb_Landing_Page_0_document_0_desktop.png"
      },
      "status": "fail"
    },
    {
      "pair": {
        "reference": "..\\bitmaps_reference\\web-pres-lieb_Landing_Page_0_document_1_mobile.png",
        "test": "..\\bitmaps_test\\20250718-141657\\web-pres-lieb_Landing_Page_0_document_1_mobile.png",
        "selector": "document",
        "fileName": "web-pres-lieb_Landing_Page_0_document_1_mobile.png",
        "label": "Landing Page",
        "requireSameDimensions": true,
        "misMatchThreshold": 0.1,
        "url": "http://localhost:5173",
        "expect": 0,
        "viewportLabel": "mobile",
        "diff": {
          "isSameDimensions": true,
          "dimensionDifference": {
            "width": 0,
            "height": 0
          },
          "rawMisMatchPercentage": 9.761477572559366,
          "misMatchPercentage": "9.76",
          "analysisTime": 26
        },
        "diffImage": "..\\bitmaps_test\\20250718-141657\\failed_diff_web-pres-lieb_Landing_Page_0_document_1_mobile.png"
      },
      "status": "fail"
    },
    {
      "pair": {
        "reference": "..\\bitmaps_reference\\web-pres-lieb_Header_only_0_header_0_desktop.png",
        "test": "..\\bitmaps_test\\20250718-141657\\web-pres-lieb_Header_only_0_header_0_desktop.png",
        "selector": "header",
        "fileName": "web-pres-lieb_Header_only_0_header_0_desktop.png",
        "label": "Header only",
        "requireSameDimensions": true,
        "misMatchThreshold": 0.05,
        "url": "http://localhost:5173",
        "expect": 0,
        "viewportLabel": "desktop",
        "diff": {
          "isSameDimensions": true,
          "dimensionDifference": {
            "width": 0,
            "height": 0
          },
          "misMatchPercentage": "0.00"
        }
      },
      "status": "pass"
    },
    {
      "pair": {
        "reference": "..\\bitmaps_reference\\web-pres-lieb_Header_only_0_header_1_mobile.png",
        "test": "..\\bitmaps_test\\20250718-141657\\web-pres-lieb_Header_only_0_header_1_mobile.png",
        "selector": "header",
        "fileName": "web-pres-lieb_Header_only_0_header_1_mobile.png",
        "label": "Header only",
        "requireSameDimensions": true,
        "misMatchThreshold": 0.05,
        "url": "http://localhost:5173",
        "expect": 0,
        "viewportLabel": "mobile",
        "diff": {
          "isSameDimensions": true,
          "dimensionDifference": {
            "width": 0,
            "height": 0
          },
          "misMatchPercentage": "0.00"
        }
      },
      "status": "pass"
    }
  ],
  "id": "web-pres-lieb"
});