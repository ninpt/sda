var sampleEventsResponse = {
  "meta": {
    "disclaimer": "openFDA is a beta research project and not for clinical use. While we make every effort to ensure that data is accurate, you should assume all results are unvalidated.",
    "license": "http://open.fda.gov/license",
    "last_updated": "2015-05-22"
  },
  "results": [
    {
      "term": "Malfunction",
      "count": 2613523
    },
    {
      "term": "Injury",
      "count": 1512212
    },
    {
      "term": "Death",
      "count": 100197
    },
    {
      "term": "Other",
      "count": 98035
    },
    {
      "term": "No answer provided",
      "count": 43963
    },
    {
      "term": "",
      "count": 5308
    },
    {
      "term": "?",
      "count": 36
    }
  ]
};

// Test Chart Generation
QUnit.test( "Test Chart Generation", function( assert ) {
	var queryKey = 'events';
  var queryColumnNames = columnNames[ queryKey ];
  var queryChartColumnTypes = chartColumnTypes[ queryKey ];
  var chartType = "PieChart";
	
	drawChart(queryColumnNames, queryChartColumnTypes, sampleEventsResponse.results, chartType );
	assert.ok( svgElement === null || svgElement === undefined, "Match uninitialized state.");
  var svgElement = $('chart_div').find('svg');
  assert.ok( svgElement, "Found svg element.");
});

// Test DataTables Generation
QUnit.test( "Test DataTables Generation", function(assert) {
  var queryKey = 'events';
  var chartType = 'PieChart';
  var targetElementId = 'targetTable';
  var targetElement = $('#' + targetElementId);

  var tableTRs = $('#' + targetElementId + ' tbody tr');
  assert.ok( tableTRs.length === 0, "Match uninitialized state.");

  var done = assert.async();
  getData( queryKey, targetElementId, chartType); 
  setTimeout( function() {
    tableTRs = $('#' + targetElementId + ' tbody tr');
    assert.ok( tableTRs.length > 0, "Table rows populated.");
    done();
  });
});



