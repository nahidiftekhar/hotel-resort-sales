import dynamic from 'next/dynamic';
import { useState } from 'react';
// import ReactiveButton from 'reactive-button';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

export default function QuillComponent({
  value,
  setValue,
  deltaValue,
  setDeltaValue,
}) {
  //   const [value, setValue] = useState('');
  //   const [deltaValue, setDeltaValue] = useState('');

  //   const performAction = async () => {
  //     console.log('value: ' + value);
  //     console.log('deltaValue: ' + JSON.stringify(deltaValue));
  //   };

  const handleChangeQuill = (content, delta, source, editor) => {
    setValue(content);
    setDeltaValue(editor.getContents());
  };

  return (
    <div className="quill-container">
      <main className="">
        {/* <div className="my-2">
          <ReactiveButton
            buttonState="idle"
            idleText="Perform action"
            outline
            size="small"
            color="dark"
            onClick={performAction}
          />
        </div> */}
        <ReactQuill
          defaultValue={
            typeof window !== 'undefined'
              ? JSON.parse(localStorage.getItem('document'))
              : []
          }
          style={{ height: '50vh', width: '100%' }}
          theme="snow"
          value={value}
          onChange={handleChangeQuill}
          modules={{
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              [{ color: [] }],
              [{ align: [] }],
              [{ font: [] }],
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              [{ header: 1 }, { header: 2 }],
              [{ size: ['small', false, 'large', 'huge'] }],
              ['blockquote', 'code-block'],
              [{ list: 'ordered' }, { list: 'bullet' }],
            ],
          }}
        />
      </main>
    </div>
  );
}
