import React, { useEffect, useState } from 'react';

const server = process.env.API_URL || 'http://127.0.0.1:9000';

interface Prop {
  reload?: boolean;
  onListingCompleted?: () => void;
  selectedName?: string;
  selectedCategory?: string;
}

type formDataType = {
  selectedName1: string,
  name: string,
  category: string,
  image: string | File,
}

export const Listing: React.FC<Prop> = (props) => {

  const {reload, onListingCompleted, selectedName, selectedCategory } = props;
  // console.info(selectedName)
  const initialState = {
    selectedName1: "",
    name: "",
    category: "",
    image: "",
  };
  const [values, setValues] = useState<formDataType>(initialState);

  useEffect(()=>{
    console.log({selectedName})
  })

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

    fetch(server.concat('/items'), {
      method: 'POST',
      mode: 'cors',
      body: data,
    })
      .then(response => {
        console.log('POST status:', response.statusText);
        onListingCompleted && onListingCompleted();
      })
      .catch((error) => {
        console.error('POST error:', error);
      })
  };
  return (
    <div className='Form'>
      <form onSubmit={onSubmit}>
        <div>
          <input value={selectedName} type='text' name='name' id='name' placeholder='name' onChange={onValueChange} required />
          <input value={selectedCategory} type='text' name='category' id='category' placeholder='category' onChange={onValueChange} />
          <input type='file' name='image' id='image' onChange={onFileChange} required />
          <button type='submit'>List this item</button>
        </div>
      </form>
    </div>
  );
}
