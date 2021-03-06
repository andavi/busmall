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
if (!localStorage.getItem('allProducts')){
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

  localStorage.setItem('allProducts', JSON.stringify(allProducts));
} else {
  allProducts = JSON.parse(localStorage.getItem('allProducts'));
}



// static methods
Product.render = function(node, product) {
  var img = node.children[0];
  var text = node.children[1];
  img.src = product.src;
  text.textContent = product.name;
};

Product.voted = function(product) {
  product.votes++;
  product.appeared++;
};

Product.notVoted = function(product) {
  product.appeared++;
};

// create available indices (of allProducts) array
var availableIndices = [];
for (var i = 0; i < allProducts.length; i++) {
  availableIndices.push(i);
}
var deleteIndex = function(item) {
  availableIndices = availableIndices.filter(i => i !== item);
};

var getAndRemoveIndex = function() {
  var index = availableIndices[Math.floor(Math.random() * availableIndices.length)];
  deleteIndex(index);
  return index;
};

// render initial images
var leftIndex = getAndRemoveIndex();
var middleIndex = getAndRemoveIndex();
var rightIndex = getAndRemoveIndex();

var renderAll = function() {
  Product.render(leftDiv, allProducts[leftIndex]);
  Product.render(middleDiv, allProducts[middleIndex]);
  Product.render(rightDiv, allProducts[rightIndex]);
};
renderAll();

// helper functions
var updateVotes = function(id) {
  if (id === 'left') {
    Product.voted(allProducts[leftIndex]);
    Product.notVoted(allProducts[middleIndex]);
    Product.notVoted(allProducts[middleIndex]);
  } else if (id === 'middle') {
    Product.notVoted(allProducts[leftIndex]);
    Product.voted(allProducts[middleIndex]);
    Product.notVoted(allProducts[middleIndex]);
  } else {
    Product.notVoted(allProducts[leftIndex]);
    Product.notVoted(allProducts[middleIndex]);
    Product.voted(allProducts[middleIndex]);
  }
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

  // if clicked img or h2 get parent container node
  var id = event.target.id ? event.target.id : event.target.parentElement.id;
  updateVotes(id);

  if (totalClicks >= 25) {
    leftDiv.removeEventListener('click', handleClick);
    middleDiv.removeEventListener('click', handleClick);
    rightDiv.removeEventListener('click', handleClick);

    var h2 = document.createElement('h2');
    h2.textContent = 'Results';
    resultsList.appendChild(h2);

    // update allProducts in localStorage after 25 votes
    localStorage.setItem('allProducts', JSON.stringify(allProducts));

    // renderList();
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
  // hide elements
  document.getElementById('photos').style.display = 'none';

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
      }, {
        label: '# of Views',
        data: allProducts.map(p => p.appeared),
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
