import React, { useEffect, useState } from 'react';

interface Request {
  id: number;
  name: string;
  category: string;
  image: string;
  numOfRequesters: number;
};

const server = process.env.API_URL || 'http://127.0.0.1:9000';
const placeholderImage = process.env.PUBLIC_URL + '/logo192.png';

interface Prop {
  reload?: boolean;
  onLoadCompleted?: () => void;
}

export const RecommendedRequests: React.FC<Prop> = (props) => {
  const { reload = true, onLoadCompleted } = props;
  const [requests, setRequests] = useState<Request[]>([])
  const fetchRequests = () => {
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

  return (
    <div className='Items'>
      {requests.map((request) => {
        return (
          <div key={request.id} className='ItemList'>

            {/* TODO: Task 1: Replace the placeholder image with the item image */}
            {/* <img src={placeholderImage} /> */}
            <img className='ItemImage' src={server + (`/image/${request.image}`)} />
            <p>
              <span>{request.name}</span>
              <br />
              <span>{request.category}</span>
              <br />
              <span>123人が探しています</span>
            </p>
            <button type='submit'>List this item</button>
          </div>
        )
      })}
    </div>
  )
};
