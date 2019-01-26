import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <h2>Please open Postman to test this API or follow links below to proceed.</h2>
        <h3>Go to <a href="http://localhost:4000/api/authors"> http://localhost:4000/api/authors</a>
        to see author information.</h3>
        <h3>Use <a href="http://localhost:4000/api/posts?tags=health"> http://localhost:4000/api/posts?tag=health</a>
        to see post related to tag 'health'. You can change this tag as per your choice.</h3>
        <p> In case of any issues with running the project, send email to Kamalpreet Grewal at
         grewalkamal005@gmail.com.</p>
      </div>
    );
  }
}

export default App;
