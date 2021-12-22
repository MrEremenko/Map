import java.util.*;
import java.io.*;


public class GenShort {

  static class Node {
    double lat;
    double lon;
    String state;
    int id;

    public Node(double lat, double lon, String state, int id) {
      this.id = id;
      this.lat = lat;
      this.lon = lon;
      this.state = state;
    }

    public String toString() {
      return id + " " + lat + ", " + lon + ", " + state;
    }
  }

  static class AdjListNode {
    Node vertex;
    double weight;

    AdjListNode(Node v, double w)
    {
        vertex = v;
        weight = w;
    }
    Node getVertex() { return vertex; }
    double getWeight() { return weight; }
    public String toString() {
      return vertex.toString() + " " + weight;
    }
  }


  public static void main(String[] args) {
    ArrayList<ArrayList<Node>> states = getPoints();
    // printList(states);


    // ArrayList<ArrayList<AdjListNode>> graph = new ArrayList<>();
    //ok, now grab one at a time, and create a Adjacency list for each state
    ArrayList<ArrayList<ArrayList<AdjListNode>>> adjecencyLists = createAdjList(states);
    ArrayList<ArrayList<AdjListNode>> alaska = adjecencyLists.get(0);
    double[] distance = dijkstra(alaska, alaska.get(1).get(0).getVertex()); //pass in the first vertex...doesn't matter
    System.out.println("Vertex       Distance from Source");
    for(int i = 0; i < alaska.size(); i++) {
      System.out.println(i + "           " + distance[i]);
    }
    // System.out.println(alaska.size());
    // printList(alaska);
  }

  public static double[] dijkstra(ArrayList<ArrayList<AdjListNode>> graph, Node source) {
    int V = graph.size();
    double[] distance = new double[V];
    for(int i = 0; i < V; i++) {
      distance[i] = Double.MAX_VALUE;
    }
    distance[0] = 0;

    PriorityQueue<AdjListNode> pq = new PriorityQueue<>(
      (v1, v2) -> (int) (v1.getWeight() - v2.getWeight()));
      pq.add(new AdjListNode(source, 0));

      while(pq.size() > 0) {
        AdjListNode current = pq.poll();
        // System.out.println("Current node: " + current);

        //go through each of the neighbors, which in this case is every other point...
        for(AdjListNode n: graph.get(current.getVertex().id)) {
          //if the distance of the current node + the child is less than the child's distance, set it...
          if(distance[current.getVertex().id] + n.getWeight() < distance[n.getVertex().id]) {
            distance[n.getVertex().id] = n.getWeight() + distance[current.getVertex().id];
          
            //add this new node to the priority queue only if it is less, so we know it is the shortest at this point!
            pq.add(new AdjListNode(n.getVertex(), distance[n.getVertex().id]));
          }
        }
      }
      return distance;
  }

//get all the adjacency lists for each state!
  public static ArrayList<ArrayList<ArrayList<AdjListNode>>> createAdjList(ArrayList<ArrayList<Node>> states) {
    //all states' adjecency lists
    ArrayList<ArrayList<ArrayList<AdjListNode>>> statesAdjecencyLists = new ArrayList<>();
    for(ArrayList<Node> state : states) {
      statesAdjecencyLists.add(singleStateAdjecencyList(state));
    }
    return statesAdjecencyLists;
  }


  //create adjacency list for one state!
  public static ArrayList<ArrayList<AdjListNode>> singleStateAdjecencyList(ArrayList<Node> list) {
    //loop through each 
    ArrayList<ArrayList<AdjListNode>> build = new ArrayList<>();
    //loop through each node, and for each node, create a distance to each other node...
    for(int i = 0; i < list.size(); i++) {
      build.add(new ArrayList<AdjListNode>());
      for(int j = 0; j < list.size(); j++) {
        //don't add self
        if(i != j) {
          Node inQuestion = list.get(j);
          double distance = caclulateDistance(list.get(i), inQuestion);
          build.get(i).add(new AdjListNode(inQuestion, distance));
        }
      }
    }
    // System.out.println("Amount of things per state: " + list.size());
    // System.out.println("Size of each states' adjacency list: " + build.size());
    return build;
  }

  //TODO: change to using a routing software, this should get rid of any things to do with la agua.
  public static double caclulateDistance(Node a, Node b) {
    return getDistanceFromLatLonInMi(a.lat, a.lon, b.lat, b.lon);
  }

  //https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula?page=2&tab=active#tab-top
  public static double getDistanceFromLatLonInMi(double lat1, double lon1, double lat2, double lon2) {
    int R = 3956; // Radius of earth in Miles
    double dLat = deg2rad(lat2 - lat1);
    double dLon = deg2rad(lon2 - lon1);
    double a = 
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
    double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    double d = R * c; //distance in miles!
    return d;
  }

  public static double deg2rad(double deg) {
    return deg * (Math.PI / 180);
  }

  //just prints each thing of an arr of arr of elem E
  public static <E> void printList(ArrayList<ArrayList<E>> states) {
    for(ArrayList<E> list : states) {
      for(E n : list) {
        System.out.println(n);
      }
      System.out.println();
    }
  }


  //grabs the points from the file, must be a json object with [lat, long, "state"] format per line!
  public static ArrayList<ArrayList<Node>> getPoints() {
    ArrayList<ArrayList<Node>> states = new ArrayList<>();
    try {
      Scanner scan = new Scanner(new File("./CoordsAndState.json"));
      
      ArrayList<Node> build = new ArrayList<>();
      String prevState = "";
      int counter = 0;
      do {
        String line = scan.nextLine();
        // System.out.println(line);
        if(line.length() > 1) {
          String[] first = line.split("[\\[\\]]");
          String[] second = first[1].split(",");
          double lat = Double.parseDouble(second[0].trim());
          double lon = Double.parseDouble(second[1].trim());
          String state = second[2].substring(second[2].indexOf("\"") + 1, second[2].lastIndexOf("\""));
          // System.out.println(lat + " " + lon + " " + state);

          //add to main array list
          if(!prevState.equals(state)) {
            if(build.size() > 0)
              states.add(build);
            build = new ArrayList<>();
            prevState = state;
            counter = 0;
          }

          build.add(new Node(lat, lon, state, counter++));
        }
      } while(scan.hasNextLine());
      states.add(build);

    } catch(Exception e) {
      System.out.println("Sus bro...");
      e.printStackTrace();
    }
    return states;
  }
}