import React, { useEffect, useState } from 'react';
import { CreateRequest } from '../CreateRequestForm';


interface Item {
  id: number;
  name: string;
  category: string;
  image: string;
};

const server = process.env.API_URL || 'http://127.0.0.1:9000';
const placeholderImage = process.env.PUBLIC_URL + '/logo192.png';

interface Prop {
  reload?: boolean;
  onLoadCompleted?: () => void;
}

export const ItemList: React.FC<Prop> = (props) => {
  const { reload = true, onLoadCompleted } = props;
  const [items, setItems] = useState<Item[]>([])
  const fetchItems = () => {
    fetch(server.concat('/items'),
      {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      })
      .then(response => response.json())
      .then(data => {
        console.log('GET success:', data);
        setItems(data.items);
        onLoadCompleted && onLoadCompleted();
      })
      .catch(error => {
        console.error('GET error:', error)
      })
  }

  useEffect(() => {
    if (reload) {
      fetchItems();
    }
  }, [reload]);

  if (true){
    return (
      <div className='Items'>
        {items.map((item) => {
          return (
            <div key={item.id} className='ItemList'>
  
              {/* TODO: Task 1: Replace the placeholder image with the item image */}
              {/* <img src={placeholderImage} /> */}
              <img className='ItemImage' src={server + (`/image/${item.image}`)} />
              <div className='ItemInfo'>
                <p>
                  <span>{item.name}</span>
                  <br />
                  <span>{item.category}</span>
                </p>
              </div>
            </div>
          )
        })}
      </div>
    )
  } else{
    // const [reload, setReload] = useState(true);
    // return (
    //   <div>
    //     <div>
    //       <p>No results found</p>
    //       <p>We could not find anything that matches your search.</p>
    //     </div>
    //     <div className ='Subtitle'>
    //       <p>
    //         <b>Create new request</b>
    //       </p>
    //     </div>
    //     <div>
    //       <CreateRequest onRequestCompleted={() => setReload(true)} />
    //     </div>
    //   </div>
    // )
  }
  
};
