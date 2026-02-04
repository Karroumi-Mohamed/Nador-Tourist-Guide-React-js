import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <div>
                <h1>Nador Tourist Guide - Coming Soon</h1>
                <p>TypeScript + React working! 🎉</p>
            </div>
        </Provider>
    );
};

export default App;
