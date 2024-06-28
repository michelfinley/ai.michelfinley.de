const express = require('express');
const path = require('path');
const app = express();

const PORT = 3001;

app.use(express.static(path.join(__dirname, 'build')));

app.get("/*", function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT);
console.log("- - - ai.michelfinley.de - - -")
console.log(`Server started on port ${PORT}`);
