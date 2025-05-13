const priceElement = document.getElementById('price');
let lastPrice = null;
let lastUpdateTime = 0;

const socket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');

socket.onmessage = function (event) {
  const now = Date.now();

  // Only update every 2000ms (2 seconds)
  if (now - lastUpdateTime < 2000) return;

  const message = JSON.parse(event.data);
  const rawPrice = parseFloat(message.p);

  const formattedPrice = rawPrice.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  priceElement.textContent = formattedPrice;

  // Color based on price trend
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
  lastUpdateTime = now;
};

socket.onerror = function (error) {
  console.error('WebSocket error:', error);
  priceElement.textContent = 'Error';
  priceElement.style.color = 'white';
};
