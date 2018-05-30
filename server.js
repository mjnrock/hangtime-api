const express = require('express');
const app = express();
const PORT = 3005;

app.listen(PORT, () => {
  console.log(`Hangtime server is now listening on port: ${PORT}`);
});