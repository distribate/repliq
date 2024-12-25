storage "consul" {
  address = "consul:8500"
  path    = "vault/"
}

api_addr = "http://vault:1488"
cluster_addr = "http://vault:8201"

ui = true