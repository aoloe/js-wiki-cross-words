WikiCrosWwords = function() {
}

WikiCrosWwords.get_basedir = function get_basedir(url) {
  return url.slice(-1) == '/' ? url.slice(0, -1) : url.split('/').slice(0,-1).join('/');
}
