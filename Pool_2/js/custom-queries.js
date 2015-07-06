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

    queryUrls['drug'] = 'http://api.fda.gov/drug/event.json?search=serious:"1"+AND+drugindication:"HYPERTENSION"+AND+receivedate:[20040101+TO+20150101]&count=receivedate';
    queryUrls['drug-manu'] = 'https://api.fda.gov/drug/event.json?search=serious:"1"+AND+drugindication:"HYPERTENSION"+AND+receivedate:[20040101+TO+20150101]+AND+_exists_:companynumb&count=receivedate';
    queryUrls['drug-consumers'] = 'http://api.fda.gov/drug/event.json?search=serious:"1"+AND+drugindication:"HYPERTENSION"+AND+receivedate:[20040101+TO+20150101]+AND+_missing_:companynumb&count=receivedate';

   
    // Define DataTable Column Names  
    columnNames = [];
    columnNames['default_count'] = [
                { "data": "term" },
                { "data": "count" }
    	    ];
    columnNames['default_time'] = [
                { "data": "time" },
                { "data": "count" }
    	    ];
    columnNames['test'] = columnNames['default_count'];

    columnNames['reportOverTime'] = columnNames['default_time'];
    columnNames['reportOverTime-Consumers'] = columnNames['default_time'];
    columnNames['reportOverTime-Pacemakers'] = columnNames['default_time'];

    columnNames['devices'] = columnNames['default_count'];
    columnNames['devices-Home'] = columnNames['default_count'];
    columnNames['devices-Hospital'] = columnNames['default_count'];

    columnNames['events'] = columnNames['default_count'];
    columnNames['events-Hospital'] = columnNames['default_count'];
    columnNames['events-PaceMaker'] = columnNames['default_count'];
    
    columnNames['drug'] = columnNames['default_time'];
    columnNames['drug-manu'] = columnNames['default_time'];
    columnNames['drug-consumers'] = columnNames['default_time'];

    // Define Google Chart Column Types
    chartColumnTypes = [];
    chartColumnTypes['default_columnTypes'] = [
                { "type" : "string" },
                { "type" : "number"}
    ];
    chartColumnTypes['test'] = chartColumnTypes['default_columnTypes'];
    chartColumnTypes['reportOverTime'] = chartColumnTypes['default_columnTypes'];
    chartColumnTypes['reportOverTime-Consumers'] = chartColumnTypes['default_columnTypes'];
    chartColumnTypes['reportOverTime-Pacemakers'] = chartColumnTypes['default_columnTypes'];
    chartColumnTypes['devices'] = chartColumnTypes['default_columnTypes'];
    chartColumnTypes['devices-Home'] = chartColumnTypes['default_columnTypes'];
    chartColumnTypes['devices-Hospital'] = chartColumnTypes['default_columnTypes'];
    chartColumnTypes['events'] = chartColumnTypes['default_columnTypes'];
    chartColumnTypes['events-Hospital'] = chartColumnTypes['default_columnTypes'];
    chartColumnTypes['events-PaceMaker'] = chartColumnTypes['default_columnTypes'];
    chartColumnTypes['drug'] = chartColumnTypes['default_columnTypes'];
    chartColumnTypes['drug-manu'] = chartColumnTypes['default_columnTypes'];
    chartColumnTypes['drug-consumers'] = chartColumnTypes['default_columnTypes'];


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
                       'width':650,
                       'height':450,
                       'chartArea': {'width': '60%', 'height': '75%'},
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
