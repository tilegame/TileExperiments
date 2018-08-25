Tile Experiment
=================

A simple javascript experiment with both static and scrolling tiles.


Json Tile maps
=====================


Field Definitions
----------------------

### Top-Level Definitions

| field      | definitions
| -----------|-----------------
| ImagePath  | URL to the image used to reference the tiles
| TileWidth  | image width of each tile in pixels.
| TileHeight | image height of each tile in pixels.
| MapWidth   | number of tiles in x direction.
| MapHeight  | number of tiles in y direction.
| Data       | array of layers, which each contain a matrix of data.



### Atlas Field Definitions

The Atlas field contains information about the image file that is used by the logical map.  It gives meaning the numbers in the Data field.  The "Atlas image" can also be referred to as the "source image".


| field      | definitions
| -----------|-----------------
| ImagePath  | URL to the image used to reference the tiles.
| ImageCols  | number of columns of tiles in the source image.
| TileWidth  | image width of each tile in pixels.
| TileHeight | image height of each tile in pixels.

The `ImageCols` (image columns) field is used to convert the MapData numbers into their corresponding image in the Atlas.  For example, if `ImageCols = 3`, then MapData number `4` would reference the 1st column of the 2nd row in the source image. 

Source Image Example with `ImageCols = 3`, and their corresponding MapData numbers.
~~~~
123
456
789
~~~~

Just so the pattern is obvious, here are the first few conversions:
~~~
n	y	x

1	0	0
2	0	1
3	0	2
4	1	0
5	1	1
6	1	2
7	2	0
8	2	1
9	2	2
~~~


Python code:
~~~python
x, y = divmod(DataNum-1, ImageCols)
~~~

Javascript code for the conversion (assumes positive numbers):
~~~js
function DataNumberToLocation(DataNum, ImageCols) {
	return {
		"x": ~~((DataNum-1) / ImageCols)
		"y": (DataNum-1) % ImageCols
	}
}
~~~

 
### Notes about Data Field

If the data field were written using `array[index]` notation, then it would look like: `data[layer][row][column]`.  Note that this implies `data[layer][y][x]`, which will probably cause confusion at some point, but makes much more sense than the alternative looking at the map data.

Each Layer is an array of "Rows": each "Row" is an array of numbers.  Each number corresponds to the type of Tile.  0 always means empty.  The order of the layers in the json is the order that they will be drawn onto the Canvas.  Each layer will be drawn on top of the previous layer.




Example
---------------

~~~json
{
	"Map": 
	{
		"Width": 4,
		"Height": 4,
		"Data":
		[
			[
				[1,2,3,4],
				[1,2,3,4],
				[1,2,3,4],
				[1,2,3,4]
			],
			[
				[0,0,0,5],
				[0,0,0,5],
				[0,0,0,5],
				[0,0,0,5]
			]
		]
	},
	"Atlas": 
	{
		"ImagePath": "https://example.com/tiles.png",
		"ImageCols": 5,
		"TileWidth": 64,
		"TileHeight": 64,
	},
}
~~~

See [json/example.json](https://fractalbach.github.io/TileExperiments/json/example.json) for a current working json example.





Credits
===================

Thank you [Mozilla Developer Network](https://developer.mozilla.org/) for the web documentation and tutorials!


Specifically:

* https://developer.mozilla.org/en-US/docs/Games/Techniques/Tilemaps
* https://github.com/mozdevs/gamedev-js-tiles
