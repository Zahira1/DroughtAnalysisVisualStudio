import LayerList from "@arcgis/core/widgets/LayerList";
import Slider from "@arcgis/core/widgets/Slider";
import Legend from "@arcgis/core/widgets/Legend";

export default function CreateLayerList(view) {
    let layerList = new LayerList({
        id: "layerList",
        view: view.current,
        legendEnabled: true,
        listItemCreatedFunction: defineActions
    });

    function defineActions(event) {
        const item = event.item;
        const container = document.createElement("div");
        const legendDiv = document.createElement("div");
        const sliderDiv = document.createElement("div");
        sliderDiv.classList.add("esri-widget");
        const slider = new Slider({
            min: 0,
            max: 1,
            precision: 2,
            values: [1],
            visibleElements: {
                labels: true,
                rangeLabels: true
            },
            container: sliderDiv
        });

        slider.on("thumb-drag", (event) => {
            const { value } = event;
            item.layer.opacity = value;
        });


        item.panel = {
            content: "legend",
            open: true
        };

        legendDiv.classList.add("esri-widget");
        const legend = new Legend({
			view: view.current,
			layerInfos: [
				{
					layer: item.layer
				}
			],
			container: legendDiv
        });
        container.append(legendDiv, sliderDiv);

        item.panel = {
			content: container,
            open: true,
            className: "esri-icon-layer-list"
        };


        // Create a container to hold legend and slider
      
    }

    return layerList;
}
