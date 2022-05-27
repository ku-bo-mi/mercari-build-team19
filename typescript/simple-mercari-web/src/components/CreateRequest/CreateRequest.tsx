import React, { useState } from 'react';

const server = process.env.API_URL || 'http://127.0.0.1:9000';

interface Prop {
  onRequestCompleted?: () => void;
}

type formDataType = {
  name: string,
  category: string,
  image: string | File,
}

export const CreateRequest: React.FC<Prop> = (props) => {
  // default search word
  const searchWord = 'Fujifilm GFX100S';
  const searchCategory = 'Camera';

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
    data.append('name', values.name)
    data.append('category', values.category)
    data.append('image', values.image)

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
      <form onSubmit={onSubmit}>
        <div>
          <label className ='RegularText'>Name</label>

          <input defaultValue={searchWord} type='text' name='name' id='name' placeholder='name' onChange={onValueChange} required />
          
          <label className ='RegularText'>Category</label>
          <input defaultValue={searchCategory} type='text' name='category' id='category' placeholder='category' onChange={onValueChange} />
          
          {/* <label className ='RegularText'>Upload image:</label> */}
          {/* <input type='file' name='image' id='image' onChange={onFileChange} required /> */}
          
          <button type='submit'>Request this item</button>
        </div>
      </form>
    </div>
    </div>
    
  );
}
