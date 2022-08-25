import './App.css';
import {useState} from "react";
import Axios from "axios";






function App() {

  const [product, setProduct]= useState('');
  const [description, setDescription]= useState('');
  const [price, setPrice]= useState(0);
  const [ listaProdutos, setListaProdutos] = useState([]);

  
  const addProduct = () => {
    Axios.post('http://localhost:3001/products/create', {  /* pensar como um objeto enviado ao backend*/
      product: product, 
      description: description, 
      price: price
    }).then(()=> {
      console.log("success");
    });
  };

  const getProdutos = () => {
    Axios.get('http://localhost:3001/products').then((response)=> {
      setListaProdutos(response.data);
  });   
  }

  return ( <div className="App">
    <div className="information">
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
        <div className="produtos">
        <button onClick={getProdutos}>Mostrar produtos</button>

        {listaProdutos.map((val, key) => {
          return <div className='listaProduto'>
            <h3>Produto: {val.nome}</h3>
            <h3>Preço: {val.preco}</h3>
          </div>
        })}
        </div>
  </div>
  );
}

export default App;
