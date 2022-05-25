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
  const { onRequestCompleted } = props;
  const initialState = {
    name: "",
    category: "",
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

    fetch(server.concat('/items'), { //TODO items -> requests
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
    <div className='Form'>
      <div className ='Subtitle'>
        <p>No results found</p>
      </div>
      <div className ='RegularText'>
        <p>Sorry, we could not find anything that matches your search.</p>
        <br/>
        <br/>
      </div>
      <div className ='Subtitle'>
        <p>Want to request this item?</p>
      </div>
      <form onSubmit={onSubmit}>
        <div>
          <label className ='RegularText'>
            Name:<br/>
            <input defaultValue="Auto filled name" type='text' name='name' id='name' placeholder='name' onChange={onValueChange} required />
          </label>
          <br/>
          <label className ='RegularText'>
            Category:<br/>
            <input defaultValue="Auto filled category" type='text' name='category' id='category' placeholder='category' onChange={onValueChange} />
          </label>
          <br/>
          <label className ='RegularText'>
            Upload image:<br/>
            <input type='file' name='image' id='image' onChange={onFileChange} required />
          </label>
          <br/>
          <button type='submit'>Request this item</button>
        </div>
      </form>
    </div>
  );
}
