import { alert } from '@pnotify/core';

export function showStackBottomRight(type) {
  console.log('its PNOTIFY');
  const opts = {
    width: '150px',
    title: 'Oops(',
    text: 'Too much for me, make your request more specific.',
    stack: window.stackBottomRight,
  };
  switch (type) {
    case 'error':
      opts.title = 'Oh No';
      opts.text = 'No results!! ';
      opts.type = 'error';
      break;
    case 'info':
      opts.title = '';
      opts.text = 'Enter your search term!';
      opts.type = 'info';
      break;
    case 'success':
      opts.title = 'Great!';
      opts.text = 'I found)';
      opts.type = 'success';
      break;
  }
  alert(opts);
}
