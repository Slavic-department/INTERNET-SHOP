const http = require('http');

let server =  http.createServer(function(req, res){
    // помогает отслеживать url
    console.log(req.url)
    res.writeHead(404, {'Content-Type': 'text/plain; charset = UTF-8'});
    res.end('Ошибка 404!');
});

const jsan = {"name":"John Doe","age":32,"title":"Vicesssssss President of JavaScript"}

console.log(jsan)

const teta = {
    name: "Jojo",
    age: 22,
    title: "ora ora ora ora"
}

const data = {
    name: "John Doe",
    age: 32,
    title: "Vice President of JavaScript",
    objs: teta
}




const jsonStr = JSON.stringify(data);
console.log(jsonStr);

const decoding = JSON.parse(jsonStr);
console.log(decoding);



server.listen(3000, '127.0.0.1');
console.log("Вы подключены к порту 3000");