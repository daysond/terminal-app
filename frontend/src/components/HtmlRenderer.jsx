import React from 'react';

function HTMLRenderer({ htmlString }) {
    console.log('rendering')
  return <div dangerouslySetInnerHTML={{ __html: htmlString }}></div>;
}

export default HTMLRenderer;