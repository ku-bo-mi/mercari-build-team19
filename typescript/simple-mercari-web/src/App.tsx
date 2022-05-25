import { useState } from 'react';
import './App.css';
import { ItemList } from './components/ItemList';
import { Listing } from './components/Listing';
import { CreateRequest } from './components/CreateRequest';
import { RecommendedRequests } from './components/RecommendedRequests';

function App() {
  // reload ItemList after Listing complete
  const [reload, setReload] = useState(true);
  return (
    <div>
      <header className='Title'>
        <p>
          <b>Mercari test</b>
        </p>
      </header>
      <div className='Container'>
        <div>
          <Listing onListingCompleted={() => setReload(true)} />
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
      <div className='Container'>
        <div className ='Subtitle'>
          <p>
            <b>Create new request</b>
          </p>
        </div>
        <div>
          <CreateRequest onRequestCompleted={() => setReload(true)} />
        </div>
      </div>
      <div className='Container'>
        <div className ='Subtitle'>
          <p>
            <b>Recommended Requests</b>
          </p>
        </div>
        <div>
          <RecommendedRequests reload={reload} onLoadCompleted={() => setReload(false)} />
        </div>
      </div>
      
    </div>
  )
}

export default App;