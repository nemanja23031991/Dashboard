'use strict';

(function () {
    
    var gridster;
    
    $(document).ready(function () {
        
        //Create menu
        $('#side-menu').metisMenu();
        $('#collapse-menu').click(collapseMenuClick);

        //Connect to socketio
        var socket = io.connect();
        
        //Init gridster
        gridster = $("#grid").gridster({
            widget_base_dimensions: [75, 75],
            avoid_overlapped_widgets: true,
            autogrow_cols: true,
            widget_margins: [5, 5],
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

        }).width('auto').data('gridster');
        
        /*
        *Events 
        */
        $('.newPieChartWithCartShares').click(addPieChartWithCarShares);
        $('.newColumnWithCarShares').click(addColumnWithCarShares);
        $('.newSemiDonutChartWithCarShares').click(addSemiDonutChartWithCarShares);

        $('.newBasicLineChart').click(addBasicLineChart);
        $('.newAverageSoldCarsChart').click(addAverageSoldCarsChart);
        
        socket.on('updateTemparatureForMonth', updateTemperatureForMonth);
        socket.on('updateCarMarketShares', updateCarMarketShares);
        socket.on('updateAvgSoldCars', updateAvgSoldCars);

        $('#grid').on('click', '.removeWidget', function () { 
            gridster.remove_widget($(this).parents('li'));
        });
    });

    /*
     * New pie chart for car shares
     */
    function addPieChartWithCarShares() {
        
        var newItem = $('<li><span class="removeWidget"><i class="fa fa-times"></i></span><div class="pieChartWithCarShares chart" style="width:100%;height:100%;margin: 0 auto"></div></li>');
        
        gridster.add_widget.apply(gridster, [newItem, 4, 4]);
        
        $(newItem).find('.chart').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: 'Car market shares, 2015'
            },
            credits: false,
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
                    data: []
                }]
        });
        
        //Show loading animation
        var chart = $(newItem).find('.chart').highcharts(); 
        chart.showLoading();

        //Get carshares
        $.get('/api/carshare', {}, function (data) {
            //Update this cart
            updatePieChartWithCarShares(chart, data);
            //Remove loading animation
            chart.hideLoading();
        });
    }
    
    /*
     * New Column of car shares
     */
    function addColumnWithCarShares() {
        var newItem = $('<li><span class="removeWidget"><i class="fa fa-times"></i></span><div class="columnWithCarSharesChart chart" style="width:100%;height:100%;margin: 0 auto"></div></li>');
        
        gridster.add_widget.apply(gridster, [newItem, 6, 4]);
        
        $(newItem).find('.chart').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'Car market shares, 2015'
            },
            credits: false,
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
                    data: []
                }]
        });

        //Show loading animation
        var chart = $(newItem).find('.chart').highcharts();
        chart.showLoading();
        
        //Get carshares
        $.get('/api/carshare', {}, function (data) {
            //Update this cart
            updateColumnWithCarSharesChart(chart, data);
            //Remove loading animation
            chart.hideLoading();
        });
    }
    
    /*
     * New semi circle donut chart with car shares
     */
    function addSemiDonutChartWithCarShares() {
        var newItem = $('<li><span class="removeWidget"><i class="fa fa-times"></i></span><div class="semiDonutChartWithCarShares chart" style="width:100%;height:100%;margin: 0 auto"></div></li>');
        
        gridster.add_widget.apply(gridster, [newItem, 4, 4]);
        
        $(newItem).find('.chart').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false
            },
            title: {
                text: 'Car<br>shares<br>2015',
                align: 'center',
                verticalAlign: 'middle',
                y: 40
            },
            credits: false,
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: true,
                        distance: -50,
                        style: {
                            fontWeight: 'bold',
                            color: 'white',
                            textShadow: '0px 1px 2px black'
                        }
                    },
                    startAngle: -100,
                    endAngle: 100,
                    center: ['50%', '80%']
                }
            },
            series: [{
                    type: 'pie',
                    name: 'Car share',
                    innerSize: '60%',
                    data: []
                }]
        });

        //Show loading animation
        var chart = $(newItem).find('.chart').highcharts();
        chart.showLoading();
        
        //Get carshares
        $.get('/api/carshare', {}, function (data) {
            //Update this cart
            updateSemiDonutChartWithCarShares(chart, data);
            //Remove loading animation
            chart.hideLoading();
        });
    }
    
    /*
     * Update Car market shares 
     */
    function updateCarMarketShares(obj) {
        for (var i = 0; i < Highcharts.charts.length; i++) {
            if ($(Highcharts.charts[i].renderTo).hasClass('pieChartWithCarShares')) {
                updatePieChartWithCarShares(Highcharts.charts[i], obj);
            }
            else if ($(Highcharts.charts[i].renderTo).hasClass('columnWithCarSharesChart')) {
                updateColumnWithCarSharesChart(Highcharts.charts[i], obj); 
            }
            else if ($(Highcharts.charts[i].renderTo).hasClass('semiDonutChartWithCarShares')) {
                updateSemiDonutChartWithCarShares(Highcharts.charts[i], obj);
            }
        }
    }
    function updatePieChartWithCarShares(chart, obj){
        chart.series[0].setData(obj.data);
        chart.setTitle({ text: "Car market shares, " + obj.year });
    }
    function updateColumnWithCarSharesChart(chart, obj) {
        var columnData = [];
        for (var i = 0; i < obj.data.length; i++) {
            columnData.push({
                name: obj.data[i][0],
                y: obj.data[i][1]
            });
        }
        chart.series[0].setData(columnData);
        chart.setTitle({ text: "Car market shares, " + obj.year });
    }
    function updateSemiDonutChartWithCarShares(chart, obj) {
        var columnData = [];
        for (var i = 0; i < obj.data.length; i++) {
            columnData.push({
                name: obj.data[i][0],
                y: obj.data[i][1]
            });
        }
        chart.series[0].setData(columnData);
        chart.setTitle({ text: "Car<br>shares<br>" + obj.year });
    }
    
    
    /*
     * New basic line chart 
     */
    function addBasicLineChart() {
        var newItem = $('<li><span class="removeWidget"><i class="fa fa-times"></i></span><div class="basicLineChart chart" style="width:100%;height:100%;margin: 0 auto"></div></li>');
        
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
            credits: false,
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
    * Update BasicLineChart 
    */
    function updateTemperatureForMonth(data) {
        for (var i = 0; i < Highcharts.charts.length; i++) {
            if ($(Highcharts.charts[i].renderTo).hasClass('basicLineChart')) {
                var positionOfCity = getPositionByName(Highcharts.charts[i], data.cityName);
                if (positionOfCity > -1) {
                    Highcharts.charts[i].series[positionOfCity].data[data.month].update(data.value);
                }
            }
        }
    }

    /*
     * New area missing 
     */
    function addAverageSoldCarsChart() {
        var newItem = $('<li><span class="removeWidget"><i class="fa fa-times"></i></span><div class="averageSoldCarsChart chart" style="width:100%;height:100%;margin: 0 auto"></div></li>');
        
        gridster.add_widget.apply(gridster, [newItem, 6, 4]);
        
        $(newItem).find('.chart').highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: 'Monthly Average Number Of Sold Cars'
            },
            subtitle: {
                text: '2012'
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            yAxis: {
                title: {
                    text: 'Milions'
                }
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: false
                }
            },
            series: []
        });


        //Show loading animation
        var chart = $(newItem).find('.chart').highcharts();
        chart.showLoading();

        //Get carshares
        $.get('/api/avg-sold-cars', {}, function (data) {
            //Update this cart
            updateLineChartWithAvgSoldCars(chart, data);
            //Remove loading animation
            chart.hideLoading();
        });
    }
    
    function updateAvgSoldCars(data) {
        for (var i = 0; i < Highcharts.charts.length; i++) {
            if ($(Highcharts.charts[i].renderTo).hasClass('averageSoldCarsChart')) {
                updateLineChartWithAvgSoldCars(Highcharts.charts[i], data);
            }
        }
    }
    function updateLineChartWithAvgSoldCars(chart, obj) {

        chart.setTitle({ text: 'Monthly Average Number Of Sold Cars' }, { text: obj.year });

        for (var i = 0; i < obj.data.length; i++) {
            var position = getPositionByName(chart, obj.data[i].continentName);
            if (position > -1) {
                chart.series[position].setData(obj.data[i].data);
            }
            else {
                chart.addSeries({ name: obj.data[i].continentName, data: obj.data[i].data });
            }
        }
    }

    /**
     * Get position in chart by series name
     */
    function getPositionByName(chart, name) {
        for (var i = 0; i < chart.series.length; i++) {
            if (chart.series[i].name === name) {
                return i;
            }
        }
        return -1;
    }



    /**
     * Collapse or expand menu
     */
    function collapseMenuClick() {
        if ($('.sidebar').hasClass('reduced')) {
            $('.sidebar').removeClass('reduced');

            //Change arrow in collapse button
            $('#collapse-menu i').removeClass('fa-chevron-right');
            $('#collapse-menu i').addClass('fa-chevron-left');

            $('#page-wrapper').css('margin', '0 0 0 250px');
            $('#side-menu').show();
        }
        else {
            $('.sidebar').addClass('reduced');

            //Change arrow in collapse button
            $('#collapse-menu i').removeClass('fa-chevron-left');
            $('#collapse-menu i').addClass('fa-chevron-right');

            $('#page-wrapper').css('margin', '0 0 0 50px');
            $('#side-menu').hide();
        }
    }
})();