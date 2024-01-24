import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import './App.css';
import CustomerInformation from './Components/CustomerInformation';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';

function App() {
  const client = new ApolloClient({
    uri: 'http://localhost:3001/graphql',
    // uri: 'https://test-server-three-j3qus2dq0-denny-marcs-projects.vercel.app/graphql',
    cache: new InMemoryCache()
  });

  return (
    <>
      <ApolloProvider client={client}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh'
        }}>
          <Header />
          <div style={{ flex: 1 }}><CustomerInformation /></div>
          <Footer />
        </div>
      </ApolloProvider>
    </>
  );
}

export default App;