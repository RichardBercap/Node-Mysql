const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();


// parse application/x-www-form-urlencoded
//para reconcer datos de reques.body
app.use(bodyParser.urlencoded({ extended: false }))

// set the view engine to ejs (Establecer el motor de vistas)
app.set('view engine', 'ejs');

//creamos la varable que se conectara a mysql
const dbConnection = () => {
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tienda'
  });
};
//asignamos conecion pr reutilizarla
const connection = dbConnection();

//vista de el listado de los priductos de la base de datos
app.get('/',(req,res) => {
	
	connection.query('SELECT * FROM categories',(err,results, fields)=>{
		//console.log('The solution is: ', results[0]);
		res.render('index',{datos: results});
		//res.send("Conectado");
	});
	//res.send('Hello');
});

//vista para llenar un nuevo producto
app.get('/nuevo',(req,res) => {
	res.render('nuevo');
});
//Guardar nuevo articulo
app.post('/guardar', (req,res) => {
	const { name, slug, description, color } = req.body;
    connection.query('INSERT INTO categories SET ? ',
      {
        name,
        slug,
        description,
        color
      }
    , (err, result) => {
      res.redirect('/');
    });
    
});
//elimanra elemento
app.get('/eliminar',(req,res) => {
	const id =req.query.id;
	connection.query('DELETE FROM categories WHERE  id = '+id,(err,results, fields)=>{
		res.redirect('/');
		
	});
	console.log(req.query);
});
// plantilla cambiar datos

app.post('/cambiar',(req,res) => {
	const id = req.body.id;
	connection.query('SELECT * FROM categories WHERE  id = '+id,(err,result, fields)=>{
		res.render('update',{datos:result});
		
	});
});
//Cambiar datos en BD
app.post('/update',(req,res) => {
	//recuperamos deatos del formulario
	// para la acualizacion se manda directamente un array conj un o jeto da error
	const datos = [req.body.name, req.body.slug, req.body.description, req.body.color, req.body.id];
    connection.query('UPDATE categories SET name = ?, slug = ?, description = ?, color = ? WHERE id = ? ', datos , function (error, results, fields) {
	  if (error) throw error;
	  res.redirect('/');
	  //console.log(id);
	});
});

app.listen(8080, () =>{ 
	console.log("Servidor corriendo en localhost puerto:8080 ");
});