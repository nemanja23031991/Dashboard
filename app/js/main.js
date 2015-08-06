'use strict';

(function () {
    
    var gridster;
    
    $(document).ready(function () {
        
        //Connect to socketio
        var socket = io.connect();
        
        //Init gridster
        gridster = $("#grid").gridster({
            widget_base_dimensions: [75, 75],
            avoid_overlapped_widgets: true,
            autogrow_cols: true,
            widget_margins: [5, 5],
            min_cols: 1,
            min_rows: 1,
            helper: 'clone',
            resize: {
                enabled: true,
                stop: function (e, ui, $widget) {
                    //Reflow all charts
                    for (var i = 0; i < Highcharts.charts.length; i++) {
                        Highcharts.charts[i].reflow();
                    }
                }
            }

        }).data('gridster');
        
        /*
        *Events 
        */
        $('.newPieChart').click(addPieChart);
        $('.newBasicLineChart').click(addBasicLineChart);
        $('.newAreaMissingChart').click(addAreaMissingChart);
        $('.newColumnWithBrowserShares').click(addColumnWithBrowserShares);
        
        socket.on('updateTemparatureForMonth', updateTemperatureForMonth);
        socket.on('updateBrowserMarketShares', updateBrowserMarketShares);
    });
    /*
     * New pie chart 
     */
    function addPieChart() {
        
        var newItem = $('<li><div class="pieChart chart" style="width:100%;height:100%;margin: 0 auto"></div></li>');
        
        gridster.add_widget.apply(gridster, [newItem, 4, 4]);
        
        $(newItem).find('.chart').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: 'Browser market shares at a specific website, 2015'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        color: '#007000',
                        connectorColor: '#300000',
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                    }
                }
            },
            series: [{
                    type: 'pie',
                    name: 'Share',
                    data: [
                        ['Firefox', 25.0],
                        ['IE', 46.8], {
                            name: 'Chrome',
                            y: 12.8,
                            sliced: true,
                            selected: true
                        }, ['Safari', 8.5],
                        ['Opera', 6.2],
                        ['Others', 0.7]
                    ]
                }]
        });
    }
    /*
     * New basic line chart 
     */
    function addBasicLineChart() {
        var newItem = $('<li><div class="basicLineChart chart" style="width:100%;height:100%;margin: 0 auto"></div></li>');
        
        gridster.add_widget.apply(gridster, [newItem, 6, 4]);
        
        $(newItem).find('.chart').highcharts({
            title: {
                text: 'Monthly Average Temperature',
                x: -20 //center
            },
            subtitle: {
                text: 'Source: WorldClimate.com',
                x: -20
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            yAxis: {
                title: {
                    text: 'Temperature (°C)'
                },
                plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
            },
            tooltip: {
                valueSuffix: '°C'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{
                    name: 'Tokyo',
                    data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                }, {
                    name: 'New York',
                    data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
                }, {
                    name: 'Berlin',
                    data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
                }, {
                    name: 'London',
                    data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
                }]
        });
    }
    /*
     * New area missing 
     */
    function addAreaMissingChart() {
        var newItem = $('<li><div class="areaMissingChart chart" style="width:100%;height:100%;margin: 0 auto"></div></li>');
        
        gridster.add_widget.apply(gridster, [newItem, 6, 4]);
        
        $(newItem).find('.chart').highcharts({
            chart: {
                type: 'area',
                spacingBottom: 30
            },
            title: {
                text: 'Fruit consumption *'
            },
            subtitle: {
                text: '* Jane\'s banana consumption is unknown',
                floating: true,
                align: 'right',
                verticalAlign: 'bottom',
                y: 15
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'top',
                x: 150,
                y: 100,
                floating: true,
                borderWidth: 1,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
            },
            xAxis: {
                categories: ['Apples', 'Pears', 'Oranges', 'Bananas', 'Grapes', 'Plums', 'Strawberries', 'Raspberries']
            },
            yAxis: {
                title: {
                    text: 'Y-Axis'
                },
                labels: {
                    formatter: function () {
                        return this.value;
                    }
                }
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                    this.x + ': ' + this.y;
                }
            },
            plotOptions: {
                area: {
                    fillOpacity: 0.5
                }
            },
            credits: {
                enabled: false
            },
            series: [{
                    name: 'John',
                    data: [0, 1, 4, 4, 5, 2, 3, 7]
                }, {
                    name: 'Jane',
                    data: [1, 0, 3, null, 3, 1, 2, 1]
                }]
        });
    }
    
    /*
     * New Column of browser shares
     */
    function addColumnWithBrowserShares() {
        var newItem = $('<li><div class="columnWithBrowserSharesChart chart" style="width:100%;height:100%;margin: 0 auto"></div></li>');
        
        gridster.add_widget.apply(gridster, [newItem, 6, 4]);
        
        
        $(newItem).find('.chart').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'Browser market shares. January, 2015 to May, 2015'
            },
            subtitle: {
                text: 'Click the columns to view versions. Source: <a href="http://netmarketshare.com">netmarketshare.com</a>.'
            },
            xAxis: {
                type: 'category'
            },
            yAxis: {
                title: {
                    text: 'Total percent market share'
                }

            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y:.1f}%'
                    }
                }
            },
            
            tooltip: {
                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
            },
            
            series: [{
                    name: "Brands",
                    colorByPoint: true,
                    data: [{
                            name: "IE",
                            y: 56.33
                        }, {
                            name: "Chrome",
                            y: 24.03
                        }, {
                            name: "Firefox",
                            y: 10.38
                        }, {
                            name: "Safari",
                            y: 4.77
                        }, {
                            name: "Opera",
                            y: 0.91
                        }, {
                            name: "Others",
                            y: 0.2
                        }]
                }]
        });
    }
    
    /*
     * Update PieChart 
     */
    function updateBrowserMarketShares(data) {
        console.log(data);
        var columnData = [];
        for (var i = 0; i < data.length; i++) {
            columnData.push({
                name: data[i][0],
                y: data[i][1]
            });
        }
        console.log(columnData);
        for (var i = 0; i < Highcharts.charts.length; i++) {
            if ($(Highcharts.charts[i].renderTo).hasClass('pieChart')) {
                Highcharts.charts[i].series[0].setData(data);
            }
            if ($(Highcharts.charts[i].renderTo).hasClass('columnWithBrowserSharesChart')) {
                Highcharts.charts[i].series[0].setData(columnData);
            }
        }
    }
    
    /*
     * Update BasicLineChart 
     */
    function updateTemperatureForMonth(data) {
        console.log('Incoming updateData!', data);
        for (var i = 0; i < Highcharts.charts.length; i++) {
            if ($(Highcharts.charts[i].renderTo).hasClass('basicLineChart')) {
                var positionOfCity = getCityPosition(Highcharts.charts[i], data.cityName);
                if (positionOfCity > 0) {
                    Highcharts.charts[i].series[positionOfCity].data[data.month].update(data.value);
                }
            }
        }
    }
    
    function getCityPosition(chart, name) {
        for (var i = 0; i < chart.series.length; i++) {
            if (chart.series[i].name === name) {
                return i;
            }
        }
        return -1;
    }

})();