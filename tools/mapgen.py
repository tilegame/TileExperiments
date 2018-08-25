import json
import random

s = 20
m = s*[s*[0]]
l = []

# ==========  Layer 1  ============

# Border: Top/bottom rows
m[0] = s*[1]
m[s-1] = m[0]

# Border: Left/right columns
for i in range(s):
	m[i][0] = 1
	m[i][s-1] = 1

# Fills in the rest with random numbers.
for i in range(1, s-1):
	for j in range(1, s-1): 
		m[i][j] = random.randint(2,3)


# ==========  Layer 2  ============

# TODO

# ==========  JSON output  ============

j = {
	"Width": s,
	"Height": s,
	"Layers": 1,
	"Data": [m]
}
print(json.dumps(j, separators=(',', ':'), sort_keys=True))