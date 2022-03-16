const express=require('express');

const fs=require('fs');

const app=express();
const port=process.env.PORT || 5000;
const host='localhost';
const uniCode='UTF-8';


const dbStore='./store/todos.json';



app.use(express.json());
app.use(express.urlencoded({extended:true}));


// handling requests



app.get('/', (request,response)=>{
	response.send('Anderson API');
})


app.post('/todo', (request,response)=>{
	if(!request.body.name){
		return response.status(400).send(`Hey! The to do's name is empty`);
	}

	fs.readFile(dbStore,uniCode,(e,data)=>{
		if(e){
			return response.status(500).send('An error with the adding of the ');
		}

		let todos=JSON.parse(data);
		let maxId=Math.max.apply(null,todos.map((todo)=>todo.id));

		todos.push({
			id:++maxId,
			name:request.body.name,
			complete:false
		});


		fs.writeFile(dbStore,JSON.stringify(todos),()=>{
			return response.json({'status':'ok'});
		})


	})

})


app.get('/all', (request,response)=>{

	fs.readFile(dbStore,uniCode,(e,data)=>{

		const todos=JSON.parse(data);
		return !e?response.json({todos:todos}):response.status(500).send('Not able to connect with dd.bb');
	});
		
});


// get info from the "database"

app.get('/todos',(request,response)=>{

	// uso de request.query
	const showPending=request.query.pending; 

	console.log(showPending);

	fs.readFile(dbStore,uniCode,(e,data)=>{

		if(e){
			return response.status(500).send('something went wrong');
		}
		
		// convierto la data que obtendo que mi database
		const todos=JSON.parse(data);


		return (showPending=='true')?response.json({todos:todos.filter(e=>e.complete===true)}):response.json({todos:todos.filter(e=>e.complete===false)});
		
	})
});




app.put('/todos/:id/update', (request,response)=>{

	const id=request.params.id;
	
	const findIndexById=(todos,id)=>{

		id=parseInt(id);
		return index=todos.map(object=>object.id).indexOf(id);
	}


	fs.readFile(dbStore,uniCode,(e,data)=>{
		if(e){
			return response.status(500).send('something went wrong');
		}

		let todos=JSON.parse(data);
		let index=findIndexById(todos,id);

		if (index===-1)
			return response.status(404).send('Sorry, not found');

		todos[index].complete=!todos[index].complete;

		fs.writeFile(dbStore,JSON.stringify(todos), ()=>{
			return response.json({"status":"OK"})
		})
		
	})



})



app.listen(port,()=>{
	console.log(`Running on http://${host}:${port}`);
});