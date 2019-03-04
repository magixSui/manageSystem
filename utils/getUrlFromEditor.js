module.exports = function getUrlFromEditor(str) {
  var data = [];
  str.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, function(match, capture) {
    data.push(capture)
  });
  console.log(data)
  return data
}