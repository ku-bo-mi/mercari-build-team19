import { useState } from 'react';
import './App.css';
import { ItemList } from './components/ItemList';
import { Listing } from './components/Listing';
import { CreateRequest } from './components/CreateRequestForm';
import { CreateRequestCard } from './components/CreateRequestCard';
import { RecommendedRequests } from './components/RecommendedRequests';

function App() {
  // reload ItemList after Listing complete
  const [reload, setReload] = useState(true);
  return (
    <div>
      <header className='Title'>
        <p>
          <b>Mercari (demo for a buyer)</b>
        </p>
      </header>

      {/* <div className='Container'>
        <div>
          <CreateRequest onRequestCompleted={() => setReload(true)} />
        </div>
      </div> */}

      <div className='Container'>
        <div>
          <CreateRequestCard onRequestCompleted={() => setReload(true)} />
        </div>
      </div>

      <header className='Title'>
        <p>
          <b>Mercari (demo for a seller)</b>
        </p>
      </header>

      <div className='Container'>
        <div className ='Subtitle'>
          <p>
            <b>What do you want to sell?</b>
          </p>
        </div>
        <div>
          <Listing onListingCompleted={() => setReload(true)} />
        </div>
      </div>
      
      <div className='Container'>
        <div className ='Subtitle'>
          <p>
            <b>People are requesting these items</b>
          </p>
        </div>
        <div>
          <RecommendedRequests reload={reload} onLoadCompleted={() => setReload(false)} />
        </div>
      </div>
      
      <div className='Container'>
        <div className ='Subtitle'>
          <p>
            <b>Your items</b>
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