/* @refresh reload */
import { render } from 'solid-js/web';
import { Router, Route, A } from '@solidjs/router';

import './index.css'
import App from './App'
import TwoSided from './pages/TwoSided';

const root = document.getElementById('root');

const Index = props => (
    <>
        <h1>PDB Viewer</h1>
        <nav>
            <A href="/">Home</A>
            <A href="/twosided">TwoSided</A>
        </nav>
        {props.children}
    </>
);

render(() => (
    <Router root={Index}>
        <Route path="/" component={App} />
        <Route path="/twosided" component={TwoSided} />
    </Router>
), root!);
//render(() => (<Index />
//    //<Router root={Index}>
//    //    <Route path="/" component={TwoSided} />
//    //    // <Route path="/twosided" component={TwoSided} />
//    //</Router>
//), root!)
