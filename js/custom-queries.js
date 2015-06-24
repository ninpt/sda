    <!-- CONSTANTS -->
    // Define FDA Queries
    queryUrls = [];
    queryUrls.modifier = '&limit=20';
    queryUrls['test'] = 
        'http://api.fda.gov/drug/event.json?search=patient.drug.openfda.pharm_class_epc:nonsteroidal&count=patient.reaction.reactionmeddrapt.exact';
    queryUrls['reportOverTime'] = 'http://api.fda.gov/device/event.json?search=date_received:[20000101+TO+20150101]&count=date_received';
    queryUrls['reportOverTime-Consumers'] = 'http://api.fda.gov/device/event.json?search=date_received:[20000101+TO+20150101]+AND+source_type:consumer&count=date_received';
    queryUrls['reportOverTime-Pacemakers'] = 'http://api.fda.gov/device/event.json?search=device.generic_name:"PACEMAKER"+AND+date_received:[20000101+TO+20150101]&count=date_received';
    queryUrls['devices'] = 'http://api.fda.gov/device/event.json?&count=device.generic_name.exact';
    queryUrls['devices-Home'] = 'http://api.fda.gov/device/event.json?search=event_location.exact:HOME+event_location:patient&count=device.generic_name.exact';
    queryUrls['devices-Hospital'] = 'http://api.fda.gov/device/event.json?search=event_location:"hospital"&count=device.generic_name.exact';
    queryUrls['events'] = 'http://api.fda.gov/device/event.json?&count=event_type.exact';
    queryUrls['events-Hospital'] = 'http://api.fda.gov/device/event.json?search=event_location:"hospital"&count=event_type.exact';
    queryUrls['events-PaceMaker'] = 'http://api.fda.gov/device/event.json?search=device.generic_name:"PACEMAKER"&count=event_type.exact';
   
    // Define DataTable Column Names  
    columnNames = [];
    columnNames['test'] = [
                { "data": "term" },
                { "data": "count" }
            ];
    columnNames['reportOverTime'] = [
                { "data": "time" },
                { "data": "count" }
            ];
    columnNames['reportOverTime-Consumers'] = columnNames['reportOverTime'];
    columnNames['reportOverTime-Pacemakers'] = columnNames['reportOverTime'];

    columnNames['devices'] = [
                { "data": "term" },
                { "data": "count" }
            ];
    columnNames['devices-Home'] = columnNames['devices'];
    columnNames['devices-Hospital'] = columnNames['devices'];

    columnNames['events'] = [
                { "data": "term" },
                { "data": "count" }
            ];
    columnNames['events-Hospital'] = columnNames['events'];
    columnNames['events-PaceMaker'] = columnNames['events'];

    // Define Google Chart Column Types
    chartColumnTypes = [];
    chartColumnTypes['test'] = [
                { "type" : "string" },
                { "type" : "number"}
    ];
    chartColumnTypes['reportOverTime'] = [
                { "type" : "string" },
                { "type" : "number"}
    ];
    chartColumnTypes['reportOverTime-Consumers'] = chartColumnTypes['reportOverTime'];
    chartColumnTypes['reportOverTime-Pacemakers'] = chartColumnTypes['reportOverTime'];
    chartColumnTypes['devices'] = chartColumnTypes['reportOverTime'];
    chartColumnTypes['devices-Home'] = chartColumnTypes['reportOverTime'];
    chartColumnTypes['devices-Hospital'] = chartColumnTypes['reportOverTime'];
    chartColumnTypes['events'] = chartColumnTypes['reportOverTime'];
    chartColumnTypes['events-Hospital'] = chartColumnTypes['reportOverTime'];
    chartColumnTypes['events-PaceMaker'] = chartColumnTypes['reportOverTime'];


    // Helper method to get subset support Google Chart classes
    function selectChart(chartType, divElement) {
      var aChartType = chartType.toLowerCase();
      switch(aChartType) {
        case 'linechart':
          return new google.visualization.LineChart(divElement); 
        case 'barchart':
          return new google.visualization.BarChart(divElement); 
        case 'piechart':
          return new google.visualization.PieChart(divElement);
        default:
          return new google.visualization.LineChart(divElement); 
      }
    }

  <!-- jQuery DataTable Functions -->
    // functions
    getData = function(queryKey, targetId, chartType) {
        jQuery.support.cors = true;
    
        var queryUrl = queryUrls[ queryKey ] + queryUrls.modifier;
        var queryColumnNames = columnNames[ queryKey ];
        var queryChartColumnTypes = chartColumnTypes[ queryKey ];

        var targetTable = $('#' + targetId);   

        if ($.fn.dataTable.isDataTable( '#' + targetId )) {
            // attempt to destroy table
            targetTable.dataTable().fnDestroy();
        }
        console.log('Fetching Data.');
            targetTable.dataTable( {
                "sAjaxSource": queryUrl,
                "sAjaxDataProp": "results",
                "columns": queryColumnNames,
                "fnServerData": function ( sSource, aoData, fnCallback ) {
                     $.getJSON( sSource, aoData, function (json) { 
                        // Do whatever additional processing you want on the callback, then tell DataTables
        // console.log('json.results=' + JSON.stringify(json.results));
                        drawChart(queryColumnNames, queryChartColumnTypes, json.results, chartType );

                        // TEMPORARILY DISABLING TABLE LISTING
                        fnCallback(json)
                    } );
                } // fnServerData
            }); // datatable

    };

    <!-- Chart Generation -->
      // Load the Visualization API and the piechart package.
      google.load('visualization', '1.0', {'packages':['corechart']});

      // Set a callback to run when the Google Visualization API is loaded.
      // google.setOnLoadCallback(drawChart);

      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.
      drawChart = function(columnNames, columnTypes, jsonData, chartType) {

        // Create the data table.
        var data = new google.visualization.DataTable();

        // Define Columns
        for(var i = 0; i < columnNames.length; i++) {
          var columnName = columnNames[ i ].data;
          var columnType = columnTypes[ i ].type;
          data.addColumn( columnType, columnName );
        }

        // Data Loading Example
        //
        //data.addColumn('string', 'Topping');
        //data.addColumn('number', 'Slices');
        //data.addRows([
        // ['Mushrooms', 3],
        // ['Onions', 1],
        // ['Olives', 1],
        // ['Zucchini', 1],
        // ['Pepperoni', 2]
        // ]);
        // Add Rows
        var rows = [];
        $.each(jsonData, function(jsonIndex, jsonElement) {
          var row = [];
          $.each(columnNames, function(nameIndex, nameElement) {
            var aColumnName = nameElement.data;
            var aColumnValue = jsonElement[ aColumnName ];
            row.push( aColumnValue );
          });
          rows.push( row );
        });
        data.addRows( rows );

        // Set chart options
        var options = {// 'title':'Percentage',
                       'width':600,
                       'height':450,
                       'chartArea': {'width': '75%', 'height': '75%'},
                       'legend': {'position': 'bottom'}
                      };

        // Instantiate and draw our chart, passing in some options.
        // Chart Options: PieChart, LineChart, BarChart
        // var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
        var chartDivElement = document.getElementById('chart_div');
        var chart = selectChart( chartType, chartDivElement );
        chart.draw(data, options);
      }


    <!-- DEFAULT QUERY -->
    /*
    jQuery(document).ready( function() {
      getData('reportOverTime', 'targetTable', 'LineChart');
    });
    */
