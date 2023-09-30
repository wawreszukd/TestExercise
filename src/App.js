import logo from './logo.svg';
import './App.css';
import SongsList from './Components/SongsList';
import { ChakraProvider } from '@chakra-ui/react';
function App() {
  return (
    <ChakraProvider >
    <div className="container">
        <SongsList />
    </div>
    </ChakraProvider>
  );
}

export default App;
