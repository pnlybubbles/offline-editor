console.log('Hi, Chieri.');
var xhr = new XMLHttpRequest();
xhr.open('GET', 'external.txt');
xhr.onreadystatechange = function() {
  document.getElementById('external').innerHTML = xhr.responseText;
};
xhr.send();
