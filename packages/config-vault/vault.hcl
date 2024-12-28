storage "consul" {
  address = "consul:8500"
  path    = "vault/"
}

api_addr = "http://vault:8200"
cluster_addr = "http://vault:8201"

ui = true

listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_disable = 1 
}