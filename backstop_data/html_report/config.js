report({
  "testSuite": "BackstopJS",
  "tests": [
    {
      "pair": {
        "reference": "..\\bitmaps_reference\\web-pres-lieb_Landing_Page_0_document_0_desktop.png",
        "test": "..\\bitmaps_test\\20250717-174555\\web-pres-lieb_Landing_Page_0_document_0_desktop.png",
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
          "rawMisMatchPercentage": 2.533580043859649,
          "misMatchPercentage": "2.53",
          "analysisTime": 51
        },
        "diffImage": "..\\bitmaps_test\\20250717-174555\\failed_diff_web-pres-lieb_Landing_Page_0_document_0_desktop.png"
      },
      "status": "fail"
    },
    {
      "pair": {
        "reference": "..\\bitmaps_reference\\web-pres-lieb_Landing_Page_0_document_1_mobile.png",
        "test": "..\\bitmaps_test\\20250717-174555\\web-pres-lieb_Landing_Page_0_document_1_mobile.png",
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
          "rawMisMatchPercentage": 2.252366255144033,
          "misMatchPercentage": "2.25",
          "analysisTime": 53
        },
        "diffImage": "..\\bitmaps_test\\20250717-174555\\failed_diff_web-pres-lieb_Landing_Page_0_document_1_mobile.png"
      },
      "status": "fail"
    },
    {
      "pair": {
        "reference": "..\\bitmaps_reference\\web-pres-lieb_Header_only_0_header_0_desktop.png",
        "test": "..\\bitmaps_test\\20250717-174555\\web-pres-lieb_Header_only_0_header_0_desktop.png",
        "selector": "header",
        "fileName": "web-pres-lieb_Header_only_0_header_0_desktop.png",
        "label": "Header only",
        "requireSameDimensions": true,
        "misMatchThreshold": 0.05,
        "url": "http://localhost:5173",
        "expect": 0,
        "viewportLabel": "desktop",
        "diff": {
          "isSameDimensions": false,
          "dimensionDifference": {
            "width": 0,
            "height": -4
          },
          "rawMisMatchPercentage": 0.673828125,
          "misMatchPercentage": "0.67",
          "analysisTime": 17
        },
        "diffImage": "..\\bitmaps_test\\20250717-174555\\failed_diff_web-pres-lieb_Header_only_0_header_0_desktop.png"
      },
      "status": "fail"
    },
    {
      "pair": {
        "reference": "..\\bitmaps_reference\\web-pres-lieb_Header_only_0_header_1_mobile.png",
        "test": "..\\bitmaps_test\\20250717-174555\\web-pres-lieb_Header_only_0_header_1_mobile.png",
        "selector": "header",
        "fileName": "web-pres-lieb_Header_only_0_header_1_mobile.png",
        "label": "Header only",
        "requireSameDimensions": true,
        "misMatchThreshold": 0.05,
        "url": "http://localhost:5173",
        "expect": 0,
        "viewportLabel": "mobile",
        "diff": {
          "isSameDimensions": false,
          "dimensionDifference": {
            "width": 1,
            "height": -4
          },
          "rawMisMatchPercentage": 7.608876329787234,
          "misMatchPercentage": "7.61",
          "analysisTime": 11
        },
        "diffImage": "..\\bitmaps_test\\20250717-174555\\failed_diff_web-pres-lieb_Header_only_0_header_1_mobile.png"
      },
      "status": "fail"
    }
  ],
  "id": "web-pres-lieb"
});