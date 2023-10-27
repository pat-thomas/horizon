package main

import (
  "encoding/json"
  "log"
  "net/http"
  "os"
  "path/filepath"
  "time"

  "github.com/gorilla/mux"
)

type spaHandler struct {
  staticPath string
  indexPath string
}

func (h spaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
  // Join internally call path.Clean to prevent directory traversal
  path := filepath.Join(h.staticPath, r.URL.Path)

  // check whether a file exists or is a directory at the given path
  fi, err := os.Stat(path)
  if os.IsNotExist(err) || fi.IsDir() {
    // file does not exist or is a directory, serve index.html
    http.ServeFile(w, r, filepath.Join(h.staticPath, h.indexPath))
    return
  }

  if err != nil {
    // if we got an error (that wasn't that the file doesn't exist) stating the
    // file, return a 500 internal server error and stop
    http.Error(w, err.Error(), http.StatusInternalServerError)
    return
  }

  // otherwise, use http.FileServer to serve the static file
  http.FileServer(http.Dir(h.staticPath)).ServeHTTP(w, r)
}

func main() {
  router := mux.NewRouter()

  router.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
    // an example api handler
    json.NewEncoder(w).Encode(map[string]bool{"ok": true})
  })

  spa := spaHandler{staticPath: "build", indexPath: "index.html"}
  router.PathPrefix("/").Handler(spa)

  srv := &http.Server{
    Handler: router,
    Addr: "127.0.0.1:8080",
    WriteTimeout: 15 * time.Second,
    ReadTimeout: 15 * time.Second,
  }

  log.Fatal(srv.ListenAndServe())
}
