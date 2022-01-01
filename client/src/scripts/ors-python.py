import openrouteservice
import json
import requests
from openrouteservice import convert

client = openrouteservice.Client(
    key='5b3ce3597851110001cf62488de40f0a82c94f8b9ca3deafe96179ea')

c = open('../states/ME/CountyPoints.json')
# f = open('..states/WA/FixedPoints.json')

data = json.load(c)

points = []

for i in data:
    print(i)
    points.append(i[1])

c.close()

route = client.directions(
    coordinates=points,
    profile='foot-walking',
    format='geojson',
    validate=False,
    optimize_waypoints=True,
    radiuses=(2000)
)

# print(route)

f = open("./route.json", "w")
json.dump(route, f, indent=2)
f.close()


def testDirections():
    body = {"coordinates": [[-121.722346726, 48.0460953466],
                            [-123.828620824, 47.1444090738]], "radiuses": 1000}

    headers = {
        'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
        'Authorization': '5b3ce3597851110001cf62488de40f0a82c94f8b9ca3deafe96179ea',
        'Content-Type': 'application/json; charset=utf-8'
    }
    call = requests.post(
        'https://api.openrouteservice.org/v2/directions/foot-walking', json=body, headers=headers)

    print(call.status_code, call.reason)
    print(json.dumps(json.loads(call.text), indent=4))


def local():
    coords = ((-122.25873, 47.83563), (-122.22199, 47.88667))

    # key can be omitted for local host
    client = openrouteservice.Client(base_url='http://localhost:8080/ors')

    # Only works if you didn't change the ORS endpoints manually
    routes = client.directions(coords)

    routes = client.directions(coords, profile='driving-car', radiuses=[750])

    print(routes)


def simple_directions():
    coords = ((48.0460953466, -121.722346726), (47.1444090738, -123.828620824))

    # Specify your personal API key
    client = openrouteservice.Client(
        key='5b3ce3597851110001cf62488de40f0a82c94f8b9ca3deafe96179ea')
    routes = client.directions(coords)

    geometry = routes['routes'][0]['geometry']
    print(geometry)
    decoded = convert.decode_polyline(geometry)
    print(decoded['coordinates'])

    # print(json.dumps(routes, indent=4))
