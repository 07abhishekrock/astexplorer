import React, { useRef, useState } from 'react';

const safeParseJson = (jsonString)=>{
  try{
    const json = JSON.parse(jsonString);
    return json;
  }
  catch(e){
    return null;
  }
}

const connectToWebsocket = (url, connect, message, error, close)=>{
  const ws = new WebSocket(url);
  ws.addEventListener('open' , ()=>{
    connect && connect();
  })
  ws.addEventListener('message', (msg)=>{

    const dataReceived = safeParseJson( msg.data );

    if(dataReceived && dataReceived.type === 'code-push'){
      //code push
      message({ sourceCode: dataReceived.sourceCode });
    }

  })
  ws.addEventListener('close', ()=>{
    close && close();
  })

  ws.addEventListener('error', (err)=>{
    error && error();
    console.log(err);
  })

  return ()=>{
    ws.close();
  }
}

const RemoteEditorConnectInput = ({onCodePush})=>{

  const [isWebsocketConnected, setIsWebsocketConnected] = useState(false);
  const [websocketURL, setWebsocketURL] = useState('');

  const onConnectionClose = ()=>{
    console.log('Connection closed for websocket ', websocketURL);
    setWebsocketURL('');
    setIsWebsocketConnected(false);
  }
  const disconnectRef = useRef();

  if(!isWebsocketConnected){

    return <form className="remote-form-wrapper" onSubmit={(e)=>{
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const url = formData.get('url');
        const disconnect = connectToWebsocket(url, ()=>{
          console.log('Succesfully connected to websocket server');
          setIsWebsocketConnected(true);
          setWebsocketURL(url);
        }, (msg)=>{
          const msgReceived = msg;
          onCodePush && onCodePush(msgReceived.sourceCode);
        }, (err)=>{
          console.log('some error occurred', err);
        }, onConnectionClose);

        disconnectRef.current = disconnect;
      }}>
          <label htmlFor="websocket-url">Enter websocket url</label>
          <input id="websocket-url" name="url"/>
          <button type="submit">Connect to remote editor</button>
      </form>
  }
  else{
    return <div className="remote-form-wrapper">
      <h3>Currently Connected to {websocketURL}</h3>
      <button onClick={()=>{
        if(disconnectRef.current){
          disconnectRef.current();
        }
        onConnectionClose(); 
      }}>Disconnect</button>
    </div>
  }
}

export default RemoteEditorConnectInput;


