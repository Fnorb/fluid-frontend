report({
  "testSuite": "BackstopJS",
  "tests": [
    {
      "pair": {
        "reference": "..\\bitmaps_reference\\web-pres-lieb_Landing_Page_0_document_0_desktop.png",
        "test": "..\\bitmaps_test\\20250729-132539\\web-pres-lieb_Landing_Page_0_document_0_desktop.png",
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
          "rawMisMatchPercentage": 9.2935546875,
          "misMatchPercentage": "9.29",
          "analysisTime": 46
        },
        "diffImage": "..\\bitmaps_test\\20250729-132539\\failed_diff_web-pres-lieb_Landing_Page_0_document_0_desktop.png"
      },
      "status": "fail"
    },
    {
      "pair": {
        "reference": "..\\bitmaps_reference\\web-pres-lieb_Landing_Page_0_document_1_mobile.png",
        "test": "..\\bitmaps_test\\20250729-132539\\web-pres-lieb_Landing_Page_0_document_1_mobile.png",
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
          "rawMisMatchPercentage": 32.41859070464768,
          "misMatchPercentage": "32.42",
          "analysisTime": 23
        },
        "diffImage": "..\\bitmaps_test\\20250729-132539\\failed_diff_web-pres-lieb_Landing_Page_0_document_1_mobile.png"
      },
      "status": "fail"
    },
    {
      "pair": {
        "reference": "..\\bitmaps_reference\\web-pres-lieb_Header_only_0_header_0_desktop.png",
        "test": "..\\bitmaps_test\\20250729-132539\\web-pres-lieb_Header_only_0_header_0_desktop.png",
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
        "test": "..\\bitmaps_test\\20250729-132539\\web-pres-lieb_Header_only_0_header_1_mobile.png",
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