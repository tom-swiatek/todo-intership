import './App.css';
import axios from 'axios';
import React, { useEffect }  from 'react';
import {useState} from 'react';

function App() {
  const [itemText, setItemText] = useState('');
  const [listItems, setListItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState('');
  const [updateItemText, setUpdateItemText] = useState('');


  const addItem = async (e) =>{
    e.preventDefault();
    try{
      const res = await axios.post('http://localhost:5500/api/item', {item: itemText})
      setListItems(prev => [...prev, res.data]);
      setItemText('');
    }catch(err){
      console.log(err);
    }
  }

  useEffect(()=>{
    const getItemsList = async () =>{
      try{
        const res = await axios.get('http://localhost:5500/api/items')
        setListItems(res.data);
      }catch(err){
        console.log(err)
      }
    }
    getItemsList();
  },[])

  const deletItem = async (id) =>{
    try{
      const res = await axios.delete(`http://localhost:5500/api/item/${id}`)
      const  newListItems = listItems.filter(item => item._id !== id);
      setListItems(newListItems);
    }catch(err){
      console.log(err)
    }
  }

  const updateItem = async (e) => {
    e.preventDefault()
    try{
      const res = await axios.put(`http://localhost:5500/api/item/${isUpdating}`, {item: updateItemText})
      console.log(res.data)
      const updateItemIndex = listItems.findIndex(item => item._id === isUpdating);
      const updateItem = listItems[updateItemIndex].item = updateItemText;
      setUpdateItemText('');
      setIsUpdating('');
    }catch(err){
      console.log(err)
    }
  }

  const renderUpdateForm = () => (
    <form className="update-form" onSubmit={(e)=> {updateItem(e)}}>
      <input className="update-new-input" type="text" placeholder='New Task' onChange={e=>{setUpdateItemText(e.target.value)}} value={updateItemText}/>
      <button className="update-new-btn" type="submit">Update</button>
    </form>
  )

  return (
    <div className="App">
      <h1>What's you want to do?</h1>
      <form className="form" onSubmit={e => addItem(e)}>
        <input type="text" placeholder="Add Todo Item" onChange={e => {setItemText(e.target.value)}} value={itemText}/>
        <button type="submit">Add</button>
      </form>
      <div className="todo-listItems">
        {
          listItems.map(item => (
            <div className="todo-item">
              {
                isUpdating === item._id
                ? renderUpdateForm()
                :<>
                  <p className="item-content">{item.item}</p>
                  <button className="update-button" onClick={() => {setIsUpdating(item._id)}}>Update</button>
                  <button className="delete-button" onClick={() => {deletItem(item._id)}}>Delete</button>
                </>
              }
          </div>
          ))
        }
      </div>
    </div>
  );
}

export default App;
