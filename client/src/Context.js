import React, { Component } from 'react';
import Cookies from 'js-cookie';
import Data from './Data';

//
const Context = React.createContext();

export class Provider extends Component {

    state = {
        authenticatedUser: Cookies.getJSON('authenticatedUser') || null,
    }

    constructor() {
        super();
        this.data = new Data();    //create an instance of Data component
    }

    render() {
        const { 
            authenticatedUser, 
        } = this.state;
        const value = {
            authenticatedUser,
            data: this.data,
            actions: {
                signIn: this.signIn,
                signOut: this.signOut,
            },
        };

        return (
            <Context.Provider value={value}>
                {this.props.children}
            </Context.Provider>
        );
    }

    //user sign in with emailAddress and password, store cookies for 7 days
    signIn = async(emailAddress, password) => {
        const user = await this.data.getUser(emailAddress, password);
        if(user !== null){
            this.setState(() => {
                return {
                    authenticatedUser: user,
                };
            });
            Cookies.set('authenticatedUser', JSON.stringify(user), { expires: 7 });
        }
        return user;
    }

    //user sign out, remove cookies
    signOut = () => {
        this.setState({ authenticatedUser: null});
        Cookies.remove('authenticatedUser');
    }
}

export const Consumer = Context.Consumer;

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param {class} Component - A React component.
 * @returns {function} A higher-order component.
 */

export default function withContext(Component) {
     return function ContextComponent(props) {
         return (
             <Context.Consumer>
                 {context => <Component {...props} context={context} />}
             </Context.Consumer>
         );
     }
}
