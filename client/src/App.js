import './App.css';
import {useEffect, useState} from "react";
import Axios from "axios";

function App() {

  const [product, setProduct]= useState('');
  const [description, setDescription]= useState('');
  const [price, setPrice]= useState(0);
  const [ listaProdutos, setListaProdutos] = useState([]);
  useEffect(() => {
    getProdutos();
  },[]);

  
  const addProduct = () => {
    Axios.post('http://localhost:3001/products/create', {  /* pensar como um objeto enviado ao backend*/
      product: product, 
      description: description, 
      price: price
    }).then(()=> {
      getProdutos();
      console.log("success");
    });
  };

  const getProdutos = () => {
    Axios.get('http://localhost:3001/products').then((response)=> {
      setListaProdutos(response.data);
  });   
  }

  const deleteProduct = (id) => {
    Axios.delete('http://localhost:3001/products/'+id).then((response)=> {
      getProdutos();
  });}
  
  return ( <div className="App">
    
    <div className="information">
    <h1>Registre seu produto</h1>
      <label>Produto:</label>
      <input 
        type="text" 
        onChange={(event)=> {
          setProduct(event.target.value);
        }}/>

      <label>Descrição:</label>
      <input type="text" 
        onChange={(event)=> {
          setDescription(event.target.value);
        }}/>

      <label>Preço:</label>
      <input type="float"
        onChange={(event)=> {
          setPrice(event.target.value);
        }}/>

      <button onClick={addProduct}>Registrar Produto</button>
    </div>
      <hr />
      <h2>Lista de produtos</h2>
        <div className="produtos">
        {listaProdutos.map((val, key) => {
          return <div className='listaProduto' key={val.id}>
            <h3>Produto: {val.nome}</h3>
            <h3>Preço: {val.preco}</h3>
            <div>
              <button onClick={()=> deleteProduct(val.id)}>Excluir</button>
            </div>
          </div>
        })}
        </div>
  </div>
  );
}

export default App;
