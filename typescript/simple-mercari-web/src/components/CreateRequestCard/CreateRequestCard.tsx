import React, { useState } from 'react';

const server = process.env.API_URL || 'http://127.0.0.1:9000';

let submitted = false;

interface Prop {
  onRequestCompleted?: () => void;
}

type formDataType = {
  name: string,
  category: string,
  image: string | File,
}

export const CreateRequestCard: React.FC<Prop> = (props) => {
  // default input
  const searchWord = 'CANON TL-1';
  const searchCategory = 'Camera';
  const defaultImage = '003271552639672da51603adf5a60e8e784b3491bda0eb02fcf6b55c941dd023.jpg'

  const { onRequestCompleted } = props;
  const initialState = {
    name: searchWord,
    category: searchCategory,
    image: "",
    
  };
  const [values, setValues] = useState<formDataType>(initialState);

  const onValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values, [event.target.name]: event.target.value,
    })
  };
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values, [event.target.name]: event.target.files![0],
    })
  };
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData()
    // data.append('name', values.name)
    // data.append('category', values.category)
    // data.append('image', values.image)
    data.append('name', searchWord)
    data.append('category', searchCategory)
    data.append('image', values.image)
    
    submitted = true
    console.info("submitted: " + submitted)

    fetch(server.concat('/requests'), { //TODO items -> requests
      method: 'POST',
      mode: 'cors',
      body: data,
    })
      .then(response => {
        console.log('POST status:', response.statusText);
        onRequestCompleted && onRequestCompleted();
      })
      .catch((error) => {
        console.error('POST error:', error);
      })
  };

  if(submitted){
    return (
      <div>
        <div className='Form'>
          <form onSubmit={onSubmit}>
            <div>
              <input defaultValue={searchWord} type='text' name='keyword' placeholder='search' onChange={onValueChange} required />
              <button type='submit'>Search</button>
            </div>
          </form>
        </div>
  
        <div>
          <div className ='Subtitle'>
            <p>Sorry, no results found.</p>
          </div>
          <div className ='RegularText'>
            <p>We could not find anything that matches your search.</p>
            <br/>
            <br/>
          </div>
        </div>
  
        <div className='Form'>
        <div className ='Subtitle'>
          <p>Want to request this item?</p>
        </div>
  
        <div className='Items'>
          <form onSubmit={onSubmit} className='ItemList'>
            <img className='ItemImage' src={server + (`/image/${defaultImage}`)} />
            
            <div className='ItemInfo'>
              <p className='ItemName'>{searchWord}</p>
              <p className='ItemCategory'>{searchCategory}</p>
              <p className='ItemRequesters'>123 requests</p>
              <p>Request Created!</p>
            </div>
          </form>
        </div>
        
      </div>
      </div>
      
    );
  }
  else{
    return (
      <div>
        <div className='Form'>
          <form onSubmit={onSubmit}>
            <div>
              <input defaultValue={searchWord} type='text' name='keyword' placeholder='search' onChange={onValueChange} required />
              <button type='submit'>Search</button>
            </div>
          </form>
        </div>
  
        <div>
          <div className ='Subtitle'>
            <p>Sorry, no results found.</p>
          </div>
          <div className ='RegularText'>
            <p>We could not find anything that matches your search.</p>
            <br/>
            <br/>
          </div>
        </div>
  
        <div className='Form'>
        <div className ='Subtitle'>
          <p>Want to request this item?</p>
        </div>
  
        <div className='Items'>
          <form onSubmit={onSubmit} className='ItemList'>
            <img className='ItemImage' src={server + (`/image/${defaultImage}`)} />
            
            <div className='ItemInfo'>
              <p className='ItemName'>{searchWord}</p>
              <p className='ItemCategory'>{searchCategory}</p>
              <p className='ItemRequesters'>123 requests</p>
              <button type='submit'>Request this item</button>
            </div>
          </form>
        </div>
        
      </div>
      </div>
      
    );
  }
  
  
}
