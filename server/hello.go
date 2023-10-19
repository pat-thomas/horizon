package main

import (
  "io"
  "log"
  "net/http"
  "time"
)

var mux map[string]func(http.ResponseWriter, *http.Request)

func main() {
  server := http.Server{
    Addr: ":8080",
    Handler: &myHandler{},
    ReadTimeout: 5*time.Second,
  }

  mux = make(map[string]func(http.ResponseWriter, *http.Request))
  mux["/tmp"] = Tmp
  err := server.ListenAndServe()
  if err != nil {
    log.Fatal(err)
  }
}

type myHandler struct{}
