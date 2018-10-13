'use strict';

// get DOM nodes
var leftDiv = document.getElementById('left');
var middleDiv = document.getElementById('middle');
var rightDiv = document.getElementById('right');

// Product constructor
var allProducts = [];

var Product = function(src, name) {
  this.src = src;
  this.name = name;
  this.votes = 0;
  this.appeared = 0;
  allProducts.push(this);
};

// create Product objects
new Product('img/bag.jpg', 'Bag');
new Product('img/banana.jpg', 'Banana');
new Product('img/bathroom.jpg', 'Bathroom');
new Product('img/boots.jpg', 'Boots');
new Product('img/breakfast.jpg', 'Breakfast');
new Product('img/bubblegum.jpg', 'Bubblegum');
new Product('img/chair.jpg', 'Chair');
new Product('img/cthulhu.jpg', 'Cthulhu');
new Product('img/dog-duck.jpg', 'Dog Duck');
new Product('img/dragon.jpg', 'Dragon');
new Product('img/pen.jpg', 'Pen');
new Product('img/pet-sweep.jpg', 'Pet Sweep');
new Product('img/scissors.jpg', 'Scissors');
new Product('img/shark.jpg', 'Shark');
new Product('img/sweep.png', 'Sweep');
new Product('img/tauntaun.jpg', 'Tauntaun');
new Product('img/unicorn.jpg', 'Unicorn');
new Product('img/usb.gif', 'USB');
new Product('img/water-can.jpg', 'Water Can');
new Product('img/wine-glass.jpg', 'Wine Glass');


// prototype methods
Product.prototype.render = function(node) {
  var img = node.children[0];
  var text = node.children[1];
  img.src = this.src;
  text.textContent = this.name;
};

// render initial images
var leftIndex = 0;
var middleIndex = 1;
var rightIndex = 2;

var renderAll = function() {
  allProducts[leftIndex].render(leftDiv);
  allProducts[middleIndex].render(middleDiv);
  allProducts[rightIndex].render(rightDiv);
};

renderAll();

// click handler
var handleClick = function(event) {
  leftIndex = (leftIndex + 3) % 20;
  middleIndex = (middleIndex + 3) % 20;
  rightIndex = (rightIndex + 3) % 20;
  renderAll();
};

// add event listeners
leftDiv.addEventListener('click', handleClick);
middleDiv.addEventListener('click', handleClick);
rightDiv.addEventListener('click', handleClick);
