import openrouteservice
import json
import requests
from openrouteservice import convert


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
