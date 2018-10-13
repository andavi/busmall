'use strict';

// get DOM nodes
var leftDiv = document.getElementById('left');
var middleDiv = document.getElementById('middle');
var rightDiv = document.getElementById('right');
var resultsList = document.getElementById('results');
var ctx = document.getElementById('chart').getContext('2d');

// Product constructor
var totalClicks = 0;
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

Product.prototype.voted = function() {
  this.votes++;
  this.appeared++;
};

Product.prototype.notVoted = function() {
  this.appeared++;
};

// create available index (of allProducts) array
var availableIndices = [];
for (var i = 0; i < 20; i++) {
  availableIndices.push(i);
}
var deleteIndex = function(item) {
  availableIndices = availableIndices.filter(i => i !== item);
};

// render initial images
var leftIndex = 0;
var middleIndex = 1;
var rightIndex = 2;
deleteIndex(0);
deleteIndex(1);
deleteIndex(2);

var renderAll = function() {
  allProducts[leftIndex].render(leftDiv);
  allProducts[middleIndex].render(middleDiv);
  allProducts[rightIndex].render(rightDiv);
};
renderAll();

// helper functions
var updateVotes = function(id) {
  if (id === 'left') {
    allProducts[leftIndex].voted();
    allProducts[middleIndex].notVoted();
    allProducts[rightIndex].notVoted();
  } else if (id === 'middle') {
    allProducts[leftIndex].notVoted();
    allProducts[middleIndex].voted();
    allProducts[rightIndex].notVoted();
  } else {
    allProducts[leftIndex].notVoted();
    allProducts[middleIndex].notVoted();
    allProducts[rightIndex].voted();
  }
};

var getAndRemoveIndex = function() {
  var index = availableIndices[Math.floor(Math.random() * availableIndices.length)];
  deleteIndex(index);
  return index;
};

var updateImages = function() {
  // get new random indices from array of available
  // then delete from available so no duplicates
  var newLeftIndex = getAndRemoveIndex();
  var newMiddleIndex = getAndRemoveIndex();
  var newRightIndex = getAndRemoveIndex();

  // append old indices back into available
  availableIndices.push(leftIndex);
  availableIndices.push(middleIndex);
  availableIndices.push(rightIndex);

  // update variables to prepare for render
  leftIndex = newLeftIndex;
  middleIndex = newMiddleIndex;
  rightIndex = newRightIndex;

  renderAll();
};

// click handler
var handleClick = function(event) {
  event.preventDefault();
  event.stopPropagation();

  totalClicks++;

  var id = event.target.id ? event.target.id : event.target.parentElement.id;
  updateVotes(id);

  if (totalClicks >= 25) {
    leftDiv.removeEventListener('click', handleClick);
    middleDiv.removeEventListener('click', handleClick);
    rightDiv.removeEventListener('click', handleClick);

    renderList();
    renderChart();
    return;
  }

  updateImages();
};

// add event listeners
leftDiv.addEventListener('click', handleClick);
middleDiv.addEventListener('click', handleClick);
rightDiv.addEventListener('click', handleClick);

// render results list
var renderList = function() {
  var h2 = document.createElement('h2');
  h2.textContent = 'Results';
  resultsList.appendChild(h2);

  var ul = document.createElement('ul');
  for (var product of allProducts) {
    var li = document.createElement('li');
    var plural = product.votes === 1 ? '' : 's';
    li.textContent = `${product.votes} vote${plural} for the ${product.name}`;
    ul.appendChild(li);
  }
  resultsList.appendChild(ul);
};

// ======================================================
// CHART
// ======================================================

// get colors
// var colors = ['230, 25, 75', '60, 180, 75', '255, 225, 25', '0, 130, 200', '245, 130, 48', '145, 30, 180', '70, 240, 240', '240, 50, 230', '210, 245, 60', '250, 190, 190', '0, 128, 128', '230, 190, 255', '170, 110, 40', '255, 250, 200', '128, 0, 0', '170, 255, 195', '128, 128, 0', '255, 215, 180', '0, 0, 128', '128, 128, 128', '221, 221, 221', '0, 0, 0'];

// rainbow order
var colors = [
  '128, 0, 0',
  '170, 110, 40',
  '128, 128, 0',
  '0, 128, 128',
  '0, 0, 128',
  '0, 0, 0',
  '230, 25, 75',
  '245, 130, 48',
  '255, 225, 25',
  '210, 245, 60',
  '60, 180, 75',
  '70, 240, 240',
  '0, 130, 200',
  '145, 30, 180',
  '240, 50, 230',
  '128, 128, 128',
  '250, 190, 190',
  '255, 215, 180',
  '255, 250, 200',
  '170, 255, 195',
  '230, 190, 255',
  '221, 221, 221'
];

var colorsBorder = colors.map(c => `rgb(${c})`);
var colorsBackground = colors.map(c => `rgba(${c}, 0.4)`);

// render chart
var renderChart = function(){
  // hide ul
  resultsList.children[1].style.display = 'none';

  var chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: allProducts.map(p => p.name),
      datasets: [{
        label: '# of Votes',
        data: allProducts.map(p => p.votes),
        backgroundColor: colorsBackground,
        borderColor: colorsBorder,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero:true
          }
        }]
      }
    }
  });
};
