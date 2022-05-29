import React, { useEffect, useState } from 'react';

interface Request {
  id: number;
  name: string;
  category: string;
  image: string;
  numOfRequests: string;
};

const server = process.env.API_URL || 'http://127.0.0.1:9000';
const placeholderImage = process.env.PUBLIC_URL + '/logo192.png';

interface Prop {
  reload?: boolean;
  onLoadCompleted?: () => void;
  selectItem?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onSelectionCompleted: () => void;
}

export const RecommendedRequests: React.FC<Prop> = (props) => {
  const { reload = true, onLoadCompleted, selectItem, onSelectionCompleted } = props;
  const [requests, setRequests] = useState<Request[]>([])
  const fetchRequests = () => {
    fetch(server.concat('/requests'),
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
        setRequests(data.items);
        onLoadCompleted && onLoadCompleted();
      })
      .catch(error => {
        console.error('GET error:', error)
      })
  }

  useEffect(() => {
    if (reload) {
      fetchRequests();
    }
  }, [reload]);

  const listThisItem = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log("Clicked.");
  };

  return (
    <div className='Items'>
      {requests.map((request) => {
        return (
          <div key={request.id} className='ItemList'>

            {/* TODO: Task 1: Replace the placeholder image with the item image */}
            {/* <img src={placeholderImage} /> */}
            <img className='ItemImage' src={server + (`/image/${request.image}`)} />
            <div className='ItemInfo'>
                <p className='ItemName'>{request.name}</p>
                <p className='ItemCategory'>{request.category}</p>
                <p className='ItemRequesters'>{request.numOfRequests} requests</p>
              <button onClick={selectItem} data-name={request.name} data-category={request.category} type='submit'>List this item</button>
            </div>
          </div>
        )
      })}
    </div>
  )
};
