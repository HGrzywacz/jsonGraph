#! /usr/bin/env node

var json = require('./b2.json');

var edges = [];

var colors = {
  'object': '#F78181',
  'array': 'gold2',
  'number': 'darkseagreen',
  'string': 'beige'
};

var printHead = function () {
  return 'digraph d {\n' +
    'rankdir=LR\n' +
    'nodesep=0.1\n' +
    'concentrate=true\n' +
    'splines=true\n' +
    'node [fontname="Helvetica,Sans", fontsize=9, penwidth=1, margin="0.5, 0.04", height="0.2" ]\n' +
    'node [shape=plaintext];\n' +
    'edge [weight=10];'

};

var printTail = function () {
  return '}';
};

var printObjHead = function (name) {
  var str = ' [label=<<table border="0" cellborder="1" cellpadding="2" cellspacing="0">\n'
    + '\t<tr height="0"><td port="head" bgcolor="black"></td></tr>';
  return name + str;
};

var printObjTail = function () {
  return '\t</table>>]';
};

var printPort = function (name, value) {
  var type = typeof value;
  var bgcolor = colors[type];

  var str = '\t<tr><td port="' + name + '" bgcolor="' + bgcolor + '">' + name + '</td></tr>';
  return(str);
};

var printEdges = function () {
  var str = '';
  edges.forEach(
    function (edge) {
      str = str + edge.from + ' -> ' + edge.to + '\n';
    });
  return str;
};

var print = function (str) {
  console.log(str);
};

var diagramize = function diagramize (object, name) {

  var keys;

  if (object instanceof Array) {
    if (object.length === 0) {
      diagramize({'[ ]': '[ ]'}, name);
      return;
    }

    diagramize(object[0], name);
    return;
  } else if (object instanceof Object) {
    print(printObjHead(name));
    keys = Object.keys(object);
  } else {
    return;
  }

  keys.forEach(
    function (key) {
      var value = object[key];
      print(printPort(key, value));
    });

  print(printObjTail());

  keys.forEach(
    function (key) {
      var value = object[key];
      if (typeof value === 'object') {
        edges.push({from: name + ':' + key, to: key + ":head"});
        diagramize(value, key);
      };
    });


};

print(printHead());

diagramize(json, 'root');

print(printEdges());

print(printTail());
