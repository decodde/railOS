var x=function(){
	$.getJSON("",()=>{

	})
	var a={
		"version": 1,
		"allow_edit":true,
		"plugins": [],
		"panes": [
			{
				"width": 1,
				"row": {
					"3": 1
				},
				"col": {
					"3": 1
				},
				"col_width": 1,
				"widgets": [
					{
						"type": "text_widget",
						"settings": {
							"title": "rand",
							"size": "big",
							"value": "datasources[\"test\"][\"value\"]",
							"animate": false
						}
					}
				]
			}
		],
		"datasources": [
			{
				"name": "test",
				"type": "JSON",
				"settings": {
					"url": "http://random.rail.os/random-number/between/1/1000",
					"use_thingproxy": false,
					"refresh": 1,
					"method": "GET",
					"name": "test"
				}
			}
		],
		"columns": 3
	}
	freeboard.loadDashboard(a,false)
}


