function buildMetadata(sample) {


  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`
  // Use `.html("") to clear any existing metadata

  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.
  
  var url = `/metadata/${sample}`;

  console.log(url);

  d3.json(url).then(function(sampleData) {
    
    var selector = d3.select("#sample-metadata");
    
    selector.html("");

    Object.entries(sampleData).forEach(function([key, value]) {
      
      var row = selector.append("h6");
      row.text(`${key}: ${value}`);
    });

  });

  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

  
  var url = `/samples/${sample}`;

  console.log(url);

  d3.json(url).then(function(response) {

    var otu_ids = response.otu_ids;
    var sample_values = response.sample_values;
    var otu_labels = response.otu_labels;

    var bubbleselector = d3.select("#bubble");
    bubbleselector.html("");

    var pieselector = d3.select("#pie");
    pieselector.html("");

    var bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      text: otu_labels,
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Jet'
      }
    };
    
    var bubbleData = [bubbleTrace];
    
    var bubbleLayout = {
      showlegend: false,
      xaxis: {title: 'OTU ID'},
      height: 600,
      width: 1200
    };
    
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    Plotly.update('bubble', bubbleData, bubbleLayout);

    var pieTrace = {
      labels: otu_ids.slice(0,10),
      values: sample_values.slice(0,10),
      hovertext: otu_labels.slice(0,10),
      type: 'pie'
    };

    var pieData = [pieTrace];

    var pieLayout = {
      height: 500,
      width: 500,
      margin: {
        t: 10
      },
    };

    Plotly.newPlot('pie', pieData, pieLayout);
    Plotly.update('pie', pieData, pieLayout);

  });

  
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
