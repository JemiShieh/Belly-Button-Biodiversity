function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObject => sampleObject.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    console.log(samples);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesArray = samples.filter(sampleObject => sampleObject.id == sample);
    console.log(samplesArray);
    //  5. Create a variable that holds the first sample in the array.
    var samplesResult = samplesArray[0];
    console.log(samplesResult);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = samplesResult.otu_ids;
    console.log(otu_ids);
    var otu_labels = samplesResult.otu_labels;
    console.log(otu_labels);
    var sample_values = samplesResult.sample_values;
    console.log(sample_values);

    // Bar Chart
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otu_ids.slice(0,10).map(otu_id => `OTU ${otu_id}`).reverse();
    console.log(yticks)

    // 8. Create the trace for the bar chart. 
    var barData = [{
        x: sample_values.slice(0,10).reverse(),
        y: yticks,
        text: otu_labels.slice(0,10).reverse(),
        name: "otu_ids",
        type: "bar",
        orientation: "h"
      }, 
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
        title: "Top 10 Bacteria Cultures Discovered",
        xaxis: { title: "Sample Value" },
        yaxis: { title: "OTU ID" },
        margin: {
          l: 100,
          r: 0,
          t: 100,
          b: 100
        }
    };
    
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // Bubble Chart
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
            color: otu_ids,
            size: sample_values,
            colorscale: "Earth"
        }
    },
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
        title: "Bacteria Cultures per Sample",
        xaxis: { title: "OTU ID" },
        yaxis: { title: "Sample Value" },
        margin: {
            l: 50,
            r: 50,
            t: 30,
            b: 100
        }
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Gauge Chart
    // 3. Create a variable that holds the washing frequency.
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObject => sampleObject.id == sample);
    var result = resultArray[0];
    var wfreq = result.wfreq
    console.log(wfreq)
  
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: wfreq,
            title: { text: "Belly Button Washing Frequency <br> Scrubs per Week" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
            bar: {color: 'black'},
                axis: { range: [null, 10] },
                steps: [
                    { range: [0, 2], color: 'rgba(245, 39, 39, 1)' },
                    { range: [2, 4], color: 'rgba(245, 140, 39, 1)' },
                    { range: [4, 6], color: 'rgba(242, 245, 39, 1)' },
                    { range: [6, 8], color: 'rgba(39, 245, 42, 1)' },
                    { range: [8, 10], color: 'rgba(46, 39, 245, 1)' },
                    ],
              }
        } 
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
        width: 550, 
        height: 550, 
        margin: { 
            l: 50,
            r: 100,
            t: 0, 
            b: 50 
        }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);    

  });
}

