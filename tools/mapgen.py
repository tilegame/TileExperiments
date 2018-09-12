import json
import random

s = 100
m = [[0]*s for _ in range(s)]
m2 = [[0]*s for _ in range(s)]
l = []


EMPTY = 0
GRASS = 1
DIRT = 2
TREE = 3
TREETOP = 4
BUSH = 5

# ==========  Layer 1  ============

# Border: Top/bottom rows
m[0] = m[s-1] = s*[DIRT]


# Border: Left/right columns
for i in range(s):
	m[i][0] = DIRT
	m[i][s-1] = DIRT



# Fills in the rest with random numbers.
for i in range(1, s-1):
	for j in range(1, s-1):

		# 10% chance for a tree.
		if random.randint(0, 10) == 10:
			m[i][j] = TREE
			m2[i-1][j] = TREETOP
			continue

		# For the non-tree grassy spots, theres a 10% chance for a bush.
		m[i][j] = GRASS
		if random.randint(0, 10) == 10:
			m2[i][j] = BUSH


# ==========  JSON output  ============

j = {
	"Atlas": {
		"ImagePath": "https://fractalbach.github.io/TileExperiments/img/tiles.png",
		"ImageCols": 5,
		"TileWidth": 64,
		"TileHeight": 64
	},
	"Map": {
		"Width": s,
		"Height": s,
		"Data": [m, m2]
	}
}
print(json.dumps(j, separators=(',', ':'), sort_keys=True))
