const priceElement = document.getElementById('price');
let lastPrice = null;

const socket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');

socket.onmessage = function (event) {
  const message = JSON.parse(event.data);
  const rawPrice = parseFloat(message.p); // raw number from Binance

  // Format price with commas and two decimal places
  const formattedPrice = rawPrice.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  priceElement.textContent = formattedPrice;

  // Change color based on price trend
  if (lastPrice !== null) {
    if (rawPrice > lastPrice) {
      priceElement.style.color = 'limegreen';
    } else if (rawPrice < lastPrice) {
      priceElement.style.color = 'red';
    } else {
      priceElement.style.color = 'white';
    }
  }

  lastPrice = rawPrice;
};

socket.onerror = function (error) {
  console.error('WebSocket error:', error);
  priceElement.textContent = 'Error';
  priceElement.style.color = 'white';
};
