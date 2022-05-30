import React, { useState } from 'react';
import './App.css';
import { ItemList } from './components/ItemList';
import { Listing } from './components/Listing';
import { CreateRequest } from './components/CreateRequest';
import { CreateRequestCard } from './components/CreateRequestCard';
import { RecommendedRequests } from './components/RecommendedRequests';

function App() {
  
  // reload components
  const [reload, setReload] = useState(true);

  type formDataType = {
    name: string,
    category: string,
  }

  const initialItem: formDataType = {
    name: "",
    category: "",
  };

  // declare a state variable
  // called when a request in the recommended requests is selected 
  const [clickedItem, setClickedItem] = useState<formDataType>(initialItem);

  const selectionHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const name: string = event.currentTarget.getAttribute('data-name') ?? "";
    const category: string = event.currentTarget.getAttribute('data-category') ?? "";

    setClickedItem({
      name: name, category: category
    })
    console.info(clickedItem.name + " is selected")
    setReload(true);
  }

  return (
    <div>
      <header className='Title'>
        <p>
          <b>Mercari</b>
        </p>
      </header>

      <div className='Container'>
        <div>
          <CreateRequestCard onRequestCompleted={() => setReload(true)} />
        </div>
      </div>

      <div className='Spacer'></div>

      <header className='Title'>
        <p>
          <b>Mercari</b>
        </p>
      </header>

      <div className='Container'>
        <div className ='Subtitle'>
          <p>
            <b>What do you want to sell? / 何を出品しますか？</b>
          </p>
        </div>
        <div>
          <Listing reload={reload} onListingCompleted={() => setReload(true)} selectedName={clickedItem.name} selectedCategory={clickedItem.category} />
        </div>
      </div>
      
      <div className='Container'>
        <div className ='Subtitle'>
          <p>
            <b>People are requesting these items / こんな商品が探されています</b>
          </p>
        </div>
        <div>
          <RecommendedRequests reload={reload} onLoadCompleted={() => setReload(false)} selectItem={selectionHandler} onSelectionCompleted={() => setReload(true)}/>
        </div>
      </div>
      
      <div className='Container'>
        <div className ='Subtitle'>
          <p>
            <b>Your items / あなたが出品した商品</b>
          </p>
        </div>
        <div>
          <ItemList reload={reload} onLoadCompleted={() => setReload(false)} />
        </div>
      </div>
    </div>
  )
}

export default App;